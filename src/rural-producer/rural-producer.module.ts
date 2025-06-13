import { Module } from '@nestjs/common';
import { RuralProducerController } from './rural-producer.controller';
import { RuralProducerService } from './rural-producer.service';

@Module({
  controllers: [RuralProducerController],
  providers: [RuralProducerService],
  exports: [RuralProducerService],
})
export class RuralProducerModule {}
