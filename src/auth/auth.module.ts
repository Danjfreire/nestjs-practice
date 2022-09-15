import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AnonymousStrategy } from './strategies/anonymous.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';


@Module({
  providers: [AuthService, JwtStrategy, AnonymousStrategy],
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService]
    }),
    forwardRef(() => UsersModule),
    PassportModule,
  ],
  exports: [AuthService],
})
export class AuthModule { }
