import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';

@Module({
  providers: [AuthService],
  imports: [JwtModule.register({
    secret : jwtConstants.secret,
    signOptions: {expiresIn : '1d'}
  })],
  exports: [AuthService]
})
export class AuthModule { }
