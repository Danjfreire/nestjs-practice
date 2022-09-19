import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../auth/auth.service';
import { LoginDto } from '../../auth/dto/login.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserAuth } from '../interfaces/user.interface';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';

const MOCK_USER: UserAuth = {
  email: 'email@email.com',
  token: 'token',
  username: 'username',
  bio: 'bio',
  image: 'imageurl'
}

describe('UsersController', () => {
  let controller: UsersController;
  let userService: UsersService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: { register: jest.fn() } },
        { provide: AuthService, useValue: { login: jest.fn() } }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should login user', async () => {
    const loginData: LoginDto = { user: { email: 'email@email.com', password: 'secretpassword' } };
    const expectedUser: UserAuth = JSON.parse(JSON.stringify(MOCK_USER));

    jest.spyOn(authService, 'login').mockImplementation(async () => expectedUser);

    const res = await controller.login(loginData);

    expect(authService.login).toHaveBeenCalledWith(loginData.user.email, loginData.user.password);
    expect(res).toEqual({ user: expectedUser });

  });

  it('should register user', async () => {
    const registerData: CreateUserDto = {
      email: 'email@email.com',
      password: 'secretpassword',
      username: 'username'
    }
    const expectedUser: UserAuth = JSON.parse(JSON.stringify(MOCK_USER));

    jest.spyOn(userService, 'register').mockImplementation(async () => expectedUser);

    const res = await controller.register(registerData);

    expect(userService.register).toHaveBeenCalledWith(registerData);
    expect(res).toEqual({ user: expectedUser });
  });

});
