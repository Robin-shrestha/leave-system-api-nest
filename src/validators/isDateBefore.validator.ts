import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * @description Checks if this date property is before another date property. The constraints  0th index is the field that is to be compared with and the 1ts index determines wether to allow equal dates
 * @argument constraints [string, boolean | undefined] constraint
 * @requires constraints[0] fieldName
 */
@ValidatorConstraint({ name: 'isDateBefore', async: false })
export class IsDateBefore implements ValidatorConstraintInterface {
  validate(propertyValue: string, args: ValidationArguments) {
    const laterDate = args.object[args.constraints[0]];

    if (!laterDate) return true;
    const allowEqual = args.constraints?.[1] as boolean | undefined;

    if (allowEqual) {
      return new Date(propertyValue) <= new Date(laterDate);
    }
    return new Date(propertyValue) < new Date(laterDate);
  }

  defaultMessage(args: ValidationArguments) {
    const allowEqual = args.constraints?.[1] as boolean | undefined;

    if (allowEqual) {
      return `"${args.property}" must be before or equal to "${args.constraints[0]}"`;
    }
    return `"${args.property}" must be before "${args.constraints[0]}"`;
  }
}
