import { Type } from "class-transformer";
import { IsString, IsEmail, IsOptional, IsDefined, IsNotEmptyObject, IsObject, ValidateNested } from "class-validator";

export class UserRegistrationData {
    @IsString()
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;
}

export class CreateUserDto {

    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => UserRegistrationData)
    user : UserRegistrationData
}


export class UserUpdateData {
    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsString()
    password?: string;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsString()
    image?: string;
}

export class UpdateUserDto {

    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => UserUpdateData)
    user : UserUpdateData

}