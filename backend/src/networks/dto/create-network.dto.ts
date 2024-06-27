import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested, IsNumber, Validate, IsEthereumAddress, ArrayMinSize, IsInt, Min, Max, ArrayMaxSize } from 'class-validator';
import { Type } from 'class-transformer';
import { NodoDto } from './nodo.dto';
import { IsSubnetConstraint } from 'src/common/validators/is-subnet.constraint';
import { IsIPConstraint } from 'src/common/validators/is-ip.constraint';
import { IsEthereumAddressConstraint } from '../../common/validators/is-ethereum-address.constraint';
import { SingleMinerAndOptionalUniqueRpcNodeConstraint } from 'src/common/validators/single-miner-and-optional-unique-rpc-node.constraint';

export class CreateNetworkDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
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
    @ArrayMinSize(1)
    @ArrayMaxSize(5)
    @ValidateNested({ each: true })
    @Type(() => NodoDto)
    @Validate(SingleMinerAndOptionalUniqueRpcNodeConstraint)
    nodos: NodoDto[];
}