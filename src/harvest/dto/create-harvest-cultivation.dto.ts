import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateHarvestCultivationDto {
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
