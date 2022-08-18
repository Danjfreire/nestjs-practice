import { IsEmail, IsOptional, IsString } from "class-validator";

export interface UserData {
    email : string;
    username : string;
    password : string;
    bio ?: string;
    image ?: string;
}

export interface User {
    email : string;
    token : string;
    username : string;
    bio : string;
    image : string;
}

export class CreateUserDto {

    @IsString()
    username : string;

    @IsEmail()
    email : string;

    @IsString()
    password : string;
}

export class UpdateUserDto {

    @IsOptional()
    @IsEmail()
    email ?: string;

    @IsOptional()
    @IsString()
    username ?: string;

    @IsOptional()
    @IsString()
    password ?: string;

    @IsOptional()
    @IsString()
    bio ?: string;

    @IsOptional()
    @IsString()
    image ?: string;

}