import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class NodoDto {
    @IsString()
    @IsNotEmpty()
    type: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    ip: string;

    @IsOptional()
    @IsString()
    port: string;
}