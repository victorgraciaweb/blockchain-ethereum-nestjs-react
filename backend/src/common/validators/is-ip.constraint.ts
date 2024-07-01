import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'IsIP', async: false })
export class IsIPConstraint implements ValidatorConstraintInterface {

    validate(ip: any, args: ValidationArguments) {
        if (typeof ip !== 'string') {
            return false;
        }

        // Expresión regular para validar una dirección IPv4
        const ipv4Pattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;

        // Expresión regular para validar una dirección IPv6
        const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

        return ipv4Pattern.test(ip) || ipv6Pattern.test(ip);
    }

    defaultMessage(args: ValidationArguments) {
        return 'IP not valid (IPv4 o IPv6)';
    }
}