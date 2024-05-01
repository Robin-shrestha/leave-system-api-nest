import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * checks if this date property is after another date property
 */
@ValidatorConstraint({ name: 'isDateAfter', async: false })
export class IsDateAfter implements ValidatorConstraintInterface {
  validate(propertyValue: string, args: ValidationArguments) {
    const earlierDate = args.object[args.constraints[0]];
    return new Date(propertyValue) > new Date(earlierDate);
  }

  defaultMessage(args: ValidationArguments) {
    return `"${args.property}" must be after "${args.constraints[0]}"`;
  }
}
