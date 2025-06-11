import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RuralProducerController } from './rural-producer.controller';
import { RuralProducerService } from './rural-producer.service';

@Module({
  imports: [PrismaModule],
  controllers: [RuralProducerController],
  providers: [RuralProducerService],
})
export class RuralProducerModule {}
