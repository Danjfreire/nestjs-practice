import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserAuth } from './interfaces/user.interface';
import { User, UserDocument } from './schemas/user.schema';



@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) { }

  async register(data: CreateUserDto): Promise<UserAuth> {
    try {
      const hashedPassword = await this.authService.hashPassword(data.password);
      await this.userModel.create({
        email: data.email,
        username: data.username,
        password: hashedPassword,
      })
      // replaced with create, check if it works
      // await new this.userModel({
      //   email: data.email,
      //   username: data.username,
      //   password: hashedPassword,
      // }).save();
    } catch (error) {
      // if (error.code === 11000) {
      throw new BadRequestException('Email or username already registered');
      // }
    }

    return await this.authService.login(data.email, data.password);
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ _id: id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByUsername(username: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ username });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(email: string, data: UpdateUserDto): Promise<UserDocument> {
    if (data.password) {
      data.password = await this.authService.hashPassword(data.password);
    }

    const user = await this.userModel.findOneAndUpdate({ email }, data, {
      new: true,
    });

    return user;
  }

  async addFavoriteArticle(
    userId: string,
    articleId: string,
  ): Promise<UserDocument> {
    return await this.userModel.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { favorites: articleId } },
      { new: true },
    );
  }

  async removeFavoriteArticle(
    userId: string,
    articleId: string,
  ): Promise<UserDocument> {
    return await this.userModel.findOneAndUpdate(
      { _id: userId },
      { $pull: { favorites: articleId } },
      { new: true },
    );
  }
}
