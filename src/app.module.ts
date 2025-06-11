import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { RuralProducerModule } from './rural-producer/rural-producer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const nodeEnv = configService.get<string>('NODE_ENV');
        return {
          pinoHttp: {
            transport:
              nodeEnv === 'dev' ? { target: 'pino-pretty' } : undefined,
            redact: {
              paths: ['req.headers.authorization', 'req.headers.cookie'],
              censor: '********',
            },
          },
        };
      },
    }),
    RuralProducerModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
