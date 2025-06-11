import { PartialType } from '@nestjs/mapped-types';
import { DocumentType } from '../types';
import { CreateRuralProductorDto } from './create-rural-productor.dto';

export class UpdateRuralProductorDto extends PartialType(
  CreateRuralProductorDto,
) {
  documentType?: DocumentType;
}
