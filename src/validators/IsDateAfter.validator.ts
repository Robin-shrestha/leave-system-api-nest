import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * @description Checks if this date property is after another date property. The constraints  0th index is the field that is to be compared with and the 1ts index determines wether to allow equal dates
 * @argument constraints [string, boolean | undefined] constraint
 * @requires constraints[0] fieldName
 *  */
@ValidatorConstraint({ name: 'isDateAfter', async: false })
export class IsDateAfter implements ValidatorConstraintInterface {
  validate(propertyValue: string, args: ValidationArguments) {
    const earlierDate = args.object[args.constraints[0]];

    if (!earlierDate) return true;

    const allowEqual = args.constraints?.[1] as boolean | undefined;

    if (allowEqual) {
      return new Date(propertyValue) >= new Date(earlierDate);
    }
    return new Date(propertyValue) > new Date(earlierDate);
  }

  defaultMessage(args: ValidationArguments) {
    const allowEqual = args.constraints?.[1] as boolean | undefined;

    if (allowEqual) {
      return `"${args.property}" must be after or equal to "${args.constraints[0]}"`;
    }
    return `"${args.property}" must be after "${args.constraints[0]}"`;
  }
}
