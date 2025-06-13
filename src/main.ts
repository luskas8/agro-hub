import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NextFunction, Request, Response } from 'express';
import * as expressBasicAuth from 'express-basic-auth';
import { Logger } from 'nestjs-pino';
import { description, version } from '../package.json';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const corsOrigin = configService.get<string>('CORS_ORIGIN') || '*';
  const swaggerUsername =
    configService.get<string>('SWAGGER_USERNAME') || 'swagger-username';
  const swaggerPassword =
    configService.get<string>('SWAGGER_PASSWORD') || 'swagger-password';

  app.useLogger(app.get(Logger));

  app.enableCors({ origin: corsOrigin, credentials: true });

  const prismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  const appUser = {
    [swaggerUsername]: swaggerPassword,
  };
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path === '/health') {
      next(); // Pula a autenticação para a rota /health
    } else {
      void expressBasicAuth({
        challenge: true,
        users: appUser,
      })(req, res, next);
    }
  });
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
