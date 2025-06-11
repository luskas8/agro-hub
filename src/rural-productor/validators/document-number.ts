import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
class IsCpfCnpjConstraint implements ValidatorConstraintInterface {
  validate(documentNumber: string) {
    const formatted = documentNumber.replace(/\D/g, '');
    const cpfRegex = /^\d{11}$/; // CPF
    const cnpjRegex = /^\d{14}$/; // CNPJ
    return cpfRegex.test(formatted) || cnpjRegex.test(formatted);
  }

  defaultMessage() {
    return 'O número do documento deve ser um CPF (11 dígitos) ou CNPJ (14 dígitos)';
  }
}

export function IsValidDocument(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCpfCnpjConstraint,
    });
  };
}
