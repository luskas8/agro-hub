import { Module } from '@nestjs/common';
import { FarmService } from './farm.service';
import { FarmController } from './farm.controller';
import { RuralProducerModule } from '@src/rural-producer/rural-producer.module';

@Module({
  imports: [RuralProducerModule],
  controllers: [FarmController],
  providers: [FarmService],
  exports: [FarmService],
})
export class FarmModule {}
