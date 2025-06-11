import { Module } from '@nestjs/common';
import { RuralProductorController } from './rural-productor.controller';
import { RuralProductorService } from './rural-productor.service';

@Module({
  controllers: [RuralProductorController],
  providers: [RuralProductorService],
})
export class RuralProductorModule {}
