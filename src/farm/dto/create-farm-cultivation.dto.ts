import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateFarmCultivationDto {
  @ApiProperty({
    description: 'O ano da colheita',
    example: 2023,
    type: Number,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  harvestYear: number;

  @ApiProperty({
    description: 'O nome do cultivo',
    example: 'Milho',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value).trim().toUpperCase())
  name: string;
}
