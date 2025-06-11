import { PartialType } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { CreateRuralProductorDto } from './create-rural-productor.dto';

export class UpdateRuralProductorDto extends PartialType(
  CreateRuralProductorDto,
) {
  static toPrisma(
    dto: UpdateRuralProductorDto,
  ): Prisma.RuralProductorUpdateInput {
    return { ...dto };
  }
}
