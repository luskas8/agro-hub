import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { PrismaService } from './prisma/prisma.service';
import { RuralProductorModule } from './rural-productor/rural-productor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'prod'
            ? { target: 'pino-pretty' }
            : undefined,
      },
    }),
    RuralProductorModule,
  ],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
