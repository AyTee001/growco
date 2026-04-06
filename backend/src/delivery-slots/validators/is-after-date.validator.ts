import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsAfterDate', async: false })
export class IsAfterDateConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as Record<string, unknown>)[
      relatedPropertyName
    ];

    if (!(value instanceof Date) || !(relatedValue instanceof Date)) {
      return false;
    }

    return value.getTime() > relatedValue.getTime();
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    return `${args.property} must be later than ${relatedPropertyName}`;
  }
}

export function IsAfterDate(
  relatedPropertyName: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [relatedPropertyName],
      validator: IsAfterDateConstraint,
    });
  };
}
