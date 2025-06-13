import { PartialType } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { CreateRuralProducerDto } from './create-rural-producer.dto';

export class UpdateRuralProducerDto extends PartialType(
  CreateRuralProducerDto,
) {
  static toPrisma(
    dto: UpdateRuralProducerDto,
  ): Prisma.RuralProducerUpdateInput {
    return { ...dto };
  }
}
