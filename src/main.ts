import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as expressBasicAuth from 'express-basic-auth';
import { Logger } from 'nestjs-pino';
import { description, version } from '../package.json';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const nodeEnv = configService.get<string>('NODE_ENV');
  const corsOrigin = configService.get<string>('CORS_ORIGIN') || '*';
  const swaggerUsername =
    configService.get<string>('SWAGGER_USERNAME') || 'swagger-username';
  const swaggerPassword =
    configService.get<string>('SWAGGER_PASSWORD') || 'swagger-password';

  if (nodeEnv !== 'test') {
    // Desabilita o logger em ambiente de teste
    app.useLogger(app.get(Logger));
  }

  app.enableCors({ origin: corsOrigin, credentials: true });

  const prismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  const appUser = {
    [swaggerUsername]: swaggerPassword,
  };
  app.use(
    ['/docs', '/docs-json'],
    expressBasicAuth({
      challenge: true,
      users: appUser,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Agro Hub API')
    .setDescription('Documentation for the Agro Hub API')
    .setVersion(version)
    .addTag('agro-hub', description)
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3003);
}
bootstrap().catch((err) => {
  console.error('Error during application bootstrap:', err);
  process.exit(1);
});
