import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RuralProductorController } from './rural-productor.controller';
import { RuralProductorService } from './rural-productor.service';

@Module({
  imports: [PrismaModule],
  controllers: [RuralProductorController],
  providers: [RuralProductorService],
})
export class RuralProductorModule {}
