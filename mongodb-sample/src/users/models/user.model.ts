import { IsEmail, IsString } from "class-validator";

export interface UserData {
    _id : string;
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