import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { IsValidDocument } from '../validators/document-number';
export class CreateRuralProductorDto {
  @ApiProperty({
    description: 'Número de documento do produtor rural',
  })
  @IsString()
  @IsNotEmpty()
  @IsValidDocument()
  documentNumber: string;

  @ApiProperty({
    description: 'Nome do produtor rural',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Tipo de documento do produtor rural',
    required: false,
    enum: ['cpf', 'cnpj'],
  })
  @ValidateIf((o: CreateRuralProductorDto) => o.documentNumber !== undefined)
  @IsEnum(['cpf', 'cnpj'], {
    message: 'Os tipos de documento válidos são: cpf ou cnpj',
  })
  documentType: 'cpf' | 'cnpj';

  @ApiProperty({
    description: 'Status de atividade do produtor rural',
    default: true,
  })
  isActive: boolean = true;
}
