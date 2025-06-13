import { Module } from '@nestjs/common';
import { HarvestService } from './harvest.service';
import { HarvestController } from './harvest.controller';
import { FarmModule } from '@src/farm/farm.module';

@Module({
  imports: [FarmModule],
  controllers: [HarvestController],
  providers: [HarvestService],
  exports: [HarvestService],
})
export class HarvestModule {}
