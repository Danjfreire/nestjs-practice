import { BadRequestException, HttpException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { exec } from 'child_process';
import { AuthService } from '../../auth/auth.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserAuth } from '../interfaces/user.interface';
import { User, UserDocument } from '../schemas/user.schema';
import { UsersService } from '../users.service';

const MOCK_USER_DOC = {
  id: 'ID',
  email: 'email@email.com',
  username: 'username',
  following: [],
  favorites: [],
  bio: 'bio',
  image: 'image',
  password: 'hashedpassword'
}

const MOCK_USER: UserAuth = {
  email: 'email@email.com',
  token: 'token',
  username: 'username',
  bio: 'bio',
  image: 'imageurl'
}

describe('UsersService', () => {
  let service: UsersService;
  let authService: AuthService;
  let userModel;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: AuthService, useValue: { hashPassword: jest.fn(), login: jest.fn() } },
        { provide: getModelToken(User.name), useValue: { create: jest.fn(), findOne: jest.fn(), findOneAndUpdate: jest.fn() } }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
    userModel = module.get(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register user', async () => {
    const registerData: CreateUserDto = {
      email: 'email@email.com',
      password: 'secretpassword',
      username: 'username'
    }

    jest.spyOn(authService, 'hashPassword').mockImplementation(async () => 'hashedpassword');
    jest.spyOn(authService, 'login').mockImplementation(async () => JSON.parse(JSON.stringify(MOCK_USER)));
    jest.spyOn(userModel, 'create').mockImplementation(async () => JSON.parse(JSON.stringify(MOCK_USER_DOC)));

    const res = await service.register(registerData);

    expect(authService.hashPassword).toHaveBeenCalledWith(registerData.password);
    expect(userModel.create).toHaveBeenCalledWith({ email: registerData.email, username: registerData.username, password: 'hashedpassword' });
    expect(authService.login).toHaveBeenLastCalledWith(registerData.email, registerData.password);
    expect(res).toEqual(JSON.parse(JSON.stringify(MOCK_USER)));
  })

  it('should throw error if user registration fails', async () => {
    const registerData: CreateUserDto = {
      email: 'email@email.com',
      password: 'secretpassword',
      username: 'username'
    }

    jest.spyOn(authService, 'hashPassword').mockImplementation(async () => 'hashedpassword');
    jest.spyOn(authService, 'login').mockImplementation(async () => JSON.parse(JSON.stringify(MOCK_USER)));
    jest.spyOn(userModel, 'create').mockImplementation(async () => { throw new Error('error') });

    let badRequestException: BadRequestException;

    try {
      await service.register(registerData);
    } catch (error) {
      badRequestException = error;
    }

    expect(badRequestException).toBeDefined();
    expect(badRequestException.message).toEqual('Email or username already registered');
  })

  it('should find user by id', async () => {

    jest.spyOn(userModel, 'findOne').mockImplementation(async () => JSON.parse(JSON.stringify(MOCK_USER_DOC)));

    const res = await service.findById('id');

    expect(userModel.findOne).toHaveBeenCalledWith({ _id: 'id' });
    expect(res).toEqual(JSON.parse(JSON.stringify(MOCK_USER_DOC)));
  })

  it('should throw error if user is not found by id', async () => {
    jest.spyOn(userModel, 'findOne').mockImplementation(async () => null);

    let notFoundException: NotFoundException;
    try {
      await service.findById('id');
    } catch (error) {
      notFoundException = error;
    }

    expect(userModel.findOne).toHaveBeenCalledWith({ _id: 'id' });
    expect(notFoundException).toBeDefined();
    expect(notFoundException.message).toEqual('User not found');
  })

  it('should find user by username', async () => {

    jest.spyOn(userModel, 'findOne').mockImplementation(async () => JSON.parse(JSON.stringify(MOCK_USER_DOC)));

    const res = await service.findByUsername('username');

    expect(userModel.findOne).toHaveBeenCalledWith({ username: 'username' });
    expect(res).toEqual(JSON.parse(JSON.stringify(MOCK_USER_DOC)));
  })

  it('should throw error if user is not found by username', async () => {
    jest.spyOn(userModel, 'findOne').mockImplementation(async () => null);

    let notFoundException: NotFoundException;
    try {
      await service.findByUsername('username');
    } catch (error) {
      notFoundException = error;
    }

    expect(userModel.findOne).toHaveBeenCalledWith({ username: 'username' });
    expect(notFoundException).toBeDefined();
    expect(notFoundException.message).toEqual('User not found');
  })

  it('should find user by email', async () => {
    jest.spyOn(userModel, 'findOne').mockImplementation(async () => JSON.parse(JSON.stringify(MOCK_USER_DOC)));

    const res = await service.findByEmail('email@email.com');

    expect(userModel.findOne).toHaveBeenCalledWith({ email: 'email@email.com' });
    expect(res).toEqual(JSON.parse(JSON.stringify(MOCK_USER_DOC)));
  })

  it('should throw error if user is not found by email', async () => {
    jest.spyOn(userModel, 'findOne').mockImplementation(async () => null);

    let notFoundException: NotFoundException;
    try {
      await service.findByEmail('email@email.com');
    } catch (error) {
      notFoundException = error;
    }

    expect(userModel.findOne).toHaveBeenCalledWith({ email: 'email@email.com' });
    expect(notFoundException).toBeDefined();
    expect(notFoundException.message).toEqual('User not found');
  })

  it('should update user', async () => {
    const updateData: UpdateUserDto = {
      bio: 'updated bio',
      email: 'email@email.com',
      image: 'imageurl',
      password: 'updatedpassword',
      username: 'username'
    }

    jest.spyOn(authService, 'hashPassword').mockImplementation(async () => 'hashedPassword');
    jest.spyOn(userModel, 'findOneAndUpdate').mockImplementation(async () => JSON.parse(JSON.stringify(MOCK_USER_DOC)));

    const res = await service.update('email@email.com', updateData);

    expect(authService.hashPassword).toHaveBeenCalledWith('updatedpassword');
    expect(userModel.findOneAndUpdate).toHaveBeenCalledWith({ email: 'email@email.com' }, { ...updateData, password: 'hashedPassword' }, { new: true });
    expect(res).toEqual(JSON.parse(JSON.stringify(MOCK_USER_DOC)));
  })

  it('should add favorite article to user', async () => {
    jest.spyOn(userModel, 'findOneAndUpdate').mockImplementation(async () => JSON.parse(JSON.stringify(MOCK_USER_DOC)));

    const res = await service.addFavoriteArticle('id', 'articleid');

    expect(userModel.findOneAndUpdate).toHaveBeenCalledWith({ _id: 'id' }, { $addToSet: { favorites: 'articleid' } }, { new: true });
    expect(res).toEqual(JSON.parse(JSON.stringify(MOCK_USER_DOC)))
  })

  it('should remove favorite article from user', async () => {
    jest.spyOn(userModel, 'findOneAndUpdate').mockImplementation(async () => JSON.parse(JSON.stringify(MOCK_USER_DOC)));

    const res = await service.removeFavoriteArticle('id', 'articleid');

    expect(userModel.findOneAndUpdate).toHaveBeenCalledWith({ _id: 'id' }, { $pull: { favorites: 'articleid' } }, { new: true });
    expect(res).toEqual(JSON.parse(JSON.stringify(MOCK_USER_DOC)))
  })
});
