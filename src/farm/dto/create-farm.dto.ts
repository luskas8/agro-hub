import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateFarmDto {
  @ApiProperty({
    description: 'O nome da fazenda',
    example: 'Fazenda Boa Vista',
    required: true,
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'A cidade da fazenda',
    example: 'São Paulo',
    required: true,
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({
    description: 'O estado da fazenda',
    example: 'São Paulo',
    required: true,
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({
    description: 'A área total da fazenda em hectares',
    example: 100.5,
    required: true,
    type: 'number',
  })
  @IsNotEmpty()
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 2,
  })
  @IsPositive()
  totalAreaInHectares: number;

  @ApiProperty({
    description: 'A área de vegetação da fazenda em hectares',
    example: 50.0,
    required: true,
    type: 'number',
  })
  @IsNotEmpty()
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 2,
  })
  @IsPositive()
  vegetableAreaInHectares: number;

  @ApiProperty({
    description: 'A área de agricultável da fazenda em hectares',
    example: 30.0,
    required: true,
    type: 'number',
  })
  @IsNotEmpty()
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 2,
  })
  @IsPositive()
  arableAreaInHectares: number;

  @ApiProperty({
    description: 'ID do produtor da fazenda',
    example: 'UUID',
    required: true,
    type: 'string',
  })
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  producerId: string;

  @ApiProperty({
    description: 'Indica se a fazenda está visivel ou não',
    default: true,
    example: true,
    required: false,
    type: 'boolean',
  })
  @IsNotEmpty()
  @IsOptional()
  isActive?: boolean;

  constructor(
    name: string,
    city: string,
    state: string,
    totalAreaInHectares: number,
    vegetableAreaInHectares: number,
    arableAreaInHectares: number,
    producerId: string,
    isActive?: boolean,
  ) {
    this.name = name;
    this.city = city;
    this.state = state;
    this.totalAreaInHectares = totalAreaInHectares;
    this.vegetableAreaInHectares = vegetableAreaInHectares;
    this.arableAreaInHectares = arableAreaInHectares;
    this.producerId = producerId;
    this.isActive = isActive ?? true;
  }
}
