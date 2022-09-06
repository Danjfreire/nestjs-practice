import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { User, UserSchema } from './models/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserController } from './user.controller';

@Module({
  controllers: [UsersController, UserController],
  providers: [UsersService],
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  exports: [UsersService]
})
export class UsersModule { }
