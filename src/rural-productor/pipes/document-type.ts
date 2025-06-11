import {
  BadRequestException,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import { CreateRuralProductorDto } from '../dto/create-rural-productor.dto';

@Injectable()
export class DocumentTypePipe implements PipeTransform {
  private readonly logger = new Logger(DocumentTypePipe.name);

  transform(value: CreateRuralProductorDto) {
    this.logger.log('Transforming document type');
    if (value.documentNumber) {
      const documentNumber = value.documentNumber.replace(/\D/g, '');
      if (documentNumber.length === 11) {
        this.logger.log('Identified document as CPF');
        value.documentType = 'cpf';
      } else if (documentNumber.length === 14) {
        this.logger.log('Identified document as CNPJ');
        value.documentType = 'cnpj';
      } else {
        this.logger.warn('Invalid document type');
        throw new BadRequestException('Tipo de documento inválido.');
      }
    }

    return value;
  }
}
