import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested, IsNumber, Validate, IsEthereumAddress, ArrayMinSize, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { NodoDto } from './nodo.dto';
import { IsSubnetConstraint } from 'src/common/validators/is-subnet.constraint';
import { IsIPConstraint } from 'src/common/validators/is-ip.constraint';
import { IsEthereumAddressConstraint } from '../../common/validators/is-ethereum-address.constraint';

export class CreateNetworkDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsInt()
    @IsNotEmpty()
    @Min(1)
    @Max(100)
    chainId: string;

    @IsString()
    @IsNotEmpty()
    @Validate(IsSubnetConstraint)
    subnet: string;

    @IsString()
    @IsNotEmpty()
    @Validate(IsIPConstraint)
    ipBootnode: string;

    @IsArray()
    @IsNotEmpty({ each: true })
    @ArrayMinSize(1)
    @Validate(IsEthereumAddressConstraint, { each: true })
    alloc: string[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => NodoDto)
    nodos: NodoDto[];
}