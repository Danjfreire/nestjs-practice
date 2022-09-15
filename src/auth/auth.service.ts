import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UserAuth } from '../users/interfaces/user.interface';
import { UserDocument } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';


@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDocument> {
    const user = await this.userService.findByEmail(email);
    //check if password matches
    if (!(await argon2.verify(user.password, password))) {
      throw new BadRequestException('Invalid email or password');
    }

    return user;
  }

  async login(email: string, password: string): Promise<UserAuth> {
    const userDoc = await this.validateUser(email, password);
    const token = this.generateJwtToken(userDoc);

    return userDoc.toUserAuth(token);
  }

  generateJwtToken(user: UserDocument): string {
    const payload = {
      email: user.email,
      username: user.username,
      sub: user._id,
    };
    const token = this.jwtService.sign(payload);
    return token;
  }

  async hashPassword(password: string) {
    return await argon2.hash(password);
  }
}
