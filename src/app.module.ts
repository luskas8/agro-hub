import { PrismaModule } from '@app-prisma/prisma.module';
import { PrismaService } from '@app-prisma/prisma.service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RuralProducerModule } from '@rural-producer/rural-producer.module';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { FarmModule } from './farm/farm.module';
import { HarvestModule } from './harvest/harvest.module';
import { HarvestController } from './harvest/harvest.controller';
import { HarvestService } from './harvest/harvest.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: ['.env'],
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
              paths: [
                'req.headers.authorization',
                'req.headers.cookie',
                'req.body.password',
                'req.body.confirmPassword',
                'req.body.documentNumber',
              ],
              censor: '********',
            },
            enabled: nodeEnv !== 'test',
          },
        };
      },
    }),
    RuralProducerModule,
    PrismaModule,
    FarmModule,
    HarvestModule,
  ],
  controllers: [AppController, HarvestController],
  providers: [PrismaService, HarvestService],
})
export class AppModule {}
