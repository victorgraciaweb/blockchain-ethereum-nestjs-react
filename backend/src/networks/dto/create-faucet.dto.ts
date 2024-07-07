import { IsNotEmpty, IsPositive, IsString, Validate } from 'class-validator';
import { IsEthereumAddressConstraint } from '../../common/validators/is-ethereum-address.constraint';

export class CreateFaucetDto {
    @IsNotEmpty()
    @Validate(IsEthereumAddressConstraint)
    address: string;
    
    @IsNotEmpty()
    @IsString()
    quantity: string;
}