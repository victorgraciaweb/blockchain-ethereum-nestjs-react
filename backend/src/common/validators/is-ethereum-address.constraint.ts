import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { ethers } from 'ethers';

@ValidatorConstraint({ name: 'IsEthereumAddress', async: false })
export class IsEthereumAddressConstraint implements ValidatorConstraintInterface {

    validate(address: any, args: ValidationArguments) {
        if (typeof address !== 'string') {
            return false;
        }

        return ethers.isAddress(address);
        
    }

    defaultMessage(args: ValidationArguments) {
        return 'Ethereum address not valid';
    }
}