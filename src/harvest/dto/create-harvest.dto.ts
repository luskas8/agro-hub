import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsUUID } from 'class-validator';

export class CreateHarvestDto {
  @ApiProperty({
    description: 'ID da fazenda associada à colheita',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
    format: 'uuid',
    required: true,
    nullable: false,
  })
  @IsUUID()
  farmId: string;

  @ApiProperty({
    description: 'Ano da colheita',
    example: 2023,
    type: Number,
    required: true,
    nullable: false,
  })
  @IsNumber()
  @IsPositive()
  harvestYear: number;
}
