import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEmail,
  IsNotEmptyObject,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

export class UserCredentials {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class LoginDto {
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => UserCredentials)
  user: UserCredentials;
}
