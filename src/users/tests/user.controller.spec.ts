import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../auth/auth.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserController } from '../user.controller';
import { UsersService } from '../users.service';

const MOCK_USER_DATA = {
  id: 'userid',
  email: 'user@email.com',
  username: 'username',
  bio: 'bio',
  image: 'image',
}

describe('UserController', () => {
  let controller: UserController;
  let userService: UsersService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UsersService, useValue: { findByEmail: jest.fn(), update: jest.fn() } },
        { provide: AuthService, useValue: { generateJwtToken: jest.fn() } }
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find current logged user', async () => {
    const requestUser = { id: 'userid', email: 'user@email.com', username: 'username', }
    const expectedUser = JSON.parse(JSON.stringify(MOCK_USER_DATA))
    const mockUser = {
      toUserAuth: jest.fn((token) => ({
        ...expectedUser,
        token
      }))
    }

    jest.spyOn(userService, 'findByEmail').mockImplementation(async () => mockUser as any);
    jest.spyOn(authService, 'generateJwtToken').mockImplementation(() => 'token');

    const res = await controller.find(requestUser)

    expect(userService.findByEmail).toHaveBeenCalledWith(requestUser.email)
    expect(res).toEqual({ user: { ...expectedUser, token: 'token' } });
  });

  it('should update current user', async () => {
    const requestUser = { id: 'userid', email: 'user@email.com', username: 'username', }
    const updateDto: UpdateUserDto = {
      bio: 'updated bio'
    }
    const expectedUser = { ...JSON.parse(JSON.stringify(MOCK_USER_DATA)), bio: updateDto.bio }
    const mockUser = {
      toUserAuth: jest.fn((token) => ({
        ...JSON.parse(JSON.stringify(MOCK_USER_DATA)),
        ...updateDto,
        token
      }))
    }

    jest.spyOn(userService, 'update').mockImplementation(async () => mockUser as any);
    jest.spyOn(authService, 'generateJwtToken').mockImplementation(() => 'token');

    const res = await controller.update(updateDto, requestUser);

    expect(userService.update).toHaveBeenCalledWith(requestUser.email, updateDto);
    expect(res).toEqual({ user: { ...expectedUser, token: 'token' } })
  });

});
