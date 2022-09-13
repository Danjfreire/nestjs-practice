import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from 'src/users/schemas/user.schema';
import * as argon2 from "argon2";
import { UsersService } from 'src/users/users.service';
import { UserAuth } from 'src/users/interfaces/user.interface';

@Injectable()
export class AuthService {

    constructor(
        private jwtService: JwtService,
        private userService: UsersService
    ) { }


    async validateUser(email: string, password: string): Promise<UserDocument> {
        const user = await this.userService.findByEmail(email);
        //check if password matches
        if (!await argon2.verify(user.password, password)) {
            throw new BadRequestException('Invalid email or password');
        }

        return user;
    }

    async login(email: string, password: string): Promise<UserAuth> {
        const userDoc = await this.validateUser(email, password);
        const token = this.generateJwtToken(userDoc);

        return userDoc.toUserAuth(token)
    }

    generateJwtToken(user: UserDocument): string {
        const payload = { email: user.email, username: user.username, sub: user._id }
        const token = this.jwtService.sign(payload);
        return token;
    }

    async hashPassword(password: string) {
        return await argon2.hash(password)
    }

}
