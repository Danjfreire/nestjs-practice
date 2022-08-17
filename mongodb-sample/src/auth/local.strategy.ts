import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { User } from "src/users/models/user.model";
import { AuthService } from "./auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private authService: AuthService
    ) {
        super({usernameField : 'email'});
    }

    async validate(username : string, password : string) {
        const user = await this.authService.validateUser(username, password);

        if(!user) {
            throw new UnauthorizedException('Invalid email and/or password');
        }

        return user;
    }
}