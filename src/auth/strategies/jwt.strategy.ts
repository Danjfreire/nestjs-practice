import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: (req) => {
        if (!req.headers.authorization) {
          return null;
        }

        const [prefix, jwt] = req.headers.authorization.split(' ');

        if (prefix !== 'Token') {
          return null;
        }

        return jwt;
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return {
      username: payload.username,
      email: payload.email,
      id: payload.sub,
    };
  }
}
