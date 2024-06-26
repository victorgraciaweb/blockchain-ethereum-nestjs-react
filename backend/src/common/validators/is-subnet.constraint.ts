import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'isnet', async: false })
export class IsSubnetConstraint implements ValidatorConstraintInterface {
  validate(subnet: string, args: ValidationArguments) {
    const cidrRegex = /^([0-9]{1,3}\.){3}[0-9]{1,3}\/[0-9]{1,2}$/;
    return cidrRegex.test(subnet);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Invalid subnetwork format';
  }
}