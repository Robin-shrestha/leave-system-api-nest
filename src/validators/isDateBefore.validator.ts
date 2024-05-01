import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * checks if this date property is before another date property
 */
@ValidatorConstraint({ name: 'isDateBefore', async: false })
export class IsDateBefore implements ValidatorConstraintInterface {
  validate(propertyValue: string, args: ValidationArguments) {
    console.log('🚀 ~ IsDateAfter ~ validate ~ propertyValue:', {
      propertyValue,
      args,
    });
    const laterDate = args.object[args.constraints[0]];
    return new Date(propertyValue) < new Date(laterDate);
  }

  defaultMessage(args: ValidationArguments) {
    return `"${args.property}" must be before "${args.constraints[0]}"`;
  }
}
