import { Module } from '@nestjs/common';
import { RuralProducerModule } from '@src/rural-producer/rural-producer.module';
import { FarmController } from './farm.controller';
import { FarmService } from './farm.service';

@Module({
  imports: [RuralProducerModule],
  controllers: [FarmController],
  providers: [FarmService],
  exports: [FarmService],
})
export class FarmModule {}
