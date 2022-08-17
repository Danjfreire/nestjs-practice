import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConstants } from "./constants";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: 
            req => {
                if(!req.headers.authorization) {
                    return null;
                }

                const [prefix, jwt] = req.headers.authorization.split(' ');

                if(prefix !== 'Token') {
                    return null;
                }

                return jwt
            },
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret
        });
    }

    async validate(payload: any) {
        return { userId: payload.sub, username: payload.username, email: payload.email }
    }
}