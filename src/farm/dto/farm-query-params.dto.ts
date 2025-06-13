import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class FarmQueryParamsDto {
  @ApiProperty({
    name: 'isActive',
    required: false,
    description: 'Filtrar fazendas ativas ou inativas',
    type: Boolean,
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value === undefined) return undefined;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return value;
  })
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    name: 'producerId',
    required: false,
    description: 'ID do produtor rural para filtrar as fazendas',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsUUID('4', { message: 'producerId deve ser um UUID válido' })
  producerId?: string;

  @ApiProperty({
    name: 'state',
    required: false,
    description: 'Estado da fazenda para filtrar as fazendas',
    type: String,
    example: 'SP',
  })
  @IsOptional()
  state?: string;
}

export class OmitProduceIdFarmsQueryDto extends OmitType(FarmQueryParamsDto, [
  'producerId',
]) {}
