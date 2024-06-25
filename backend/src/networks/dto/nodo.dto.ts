import { IsIn, IsNotEmpty, IsOptional, IsString, Validate } from 'class-validator';
import { IsIPConstraint } from 'src/common/validators/is-ip.constraint';

export class NodoDto {
    @IsString()
    @IsNotEmpty()
    @IsIn(['rpc', 'normal', 'miner'])
    type: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @Validate(IsIPConstraint)
    ip: string;

    @IsOptional()
    @IsString()
    port: string;
}