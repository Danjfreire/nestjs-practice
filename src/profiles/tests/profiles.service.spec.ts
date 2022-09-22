import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { User, UserDocument } from '../../users/schemas/user.schema';
import { UsersService } from '../../users/users.service';
import { Profile } from '../interfaces/profile.model';
import { ProfilesService } from '../profiles.service';

const MOCK_PROFILE: Profile = {
  username: 'username2',
  bio: 'bio',
  image: 'imageUrl',
  following: true
}

describe('ProfilesService', () => {
  let service: ProfilesService;
  let userService: UsersService;
  let userModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilesService,
        { provide: UsersService, useValue: { findById: jest.fn(), findByUsername: jest.fn() } },
        { provide: getModelToken(User.name), useValue: { findOneAndUpdate: jest.fn() } }
      ],
    }).compile();

    service = module.get<ProfilesService>(ProfilesService);
    userService = module.get<UsersService>(UsersService);
    userModel = module.get(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find profile by username', async () => {
    const requesterDoc = {
      id: 'id1',
      email: 'email1@email.com',
      bio: 'bio1',
      following: [],
      favorites: [],
      password: 'hashedpassword',
      username: 'username1',
      image: 'iamgeurl',
      toProfile: jest.fn(),
      toUserAuth: jest.fn()
    }

    const foundUserDoc = {
      toProfile: jest.fn(() => JSON.parse(JSON.stringify(MOCK_PROFILE))),
    }

    jest.spyOn(userService, 'findById').mockImplementation(async () => requesterDoc as any);
    jest.spyOn(userService, 'findByUsername').mockImplementation(async () => foundUserDoc as any);

    const res = await service.findProfileByUsername('username2', 'id1');
    expect(userService.findById).toHaveBeenCalledWith('id1');
    expect(userService.findByUsername).toHaveBeenCalledWith('username2');
    expect(res).toEqual(JSON.parse(JSON.stringify(MOCK_PROFILE)));
  });

  it('should follow profile', async () => {
    const foundUserDoc = {
      _id: 'foundId',
      toProfile: jest.fn(() => JSON.parse(JSON.stringify(MOCK_PROFILE))),
    }

    jest.spyOn(userService, 'findByUsername').mockImplementation(async () => foundUserDoc as any);
    jest.spyOn(userModel, 'findOneAndUpdate').mockImplementation(async () => { })

    const res = await service.follow('username2', 'id1');

    expect(userService.findByUsername).toHaveBeenCalledWith('username2');
    expect(userModel.findOneAndUpdate).toHaveBeenCalledWith({ _id: 'id1' }, { $addToSet: { following: 'foundId' }}, { new: true });
    expect(res).toEqual(JSON.parse(JSON.stringify(MOCK_PROFILE)));
})

it('should unfollow profile', async () => {
  const foundUserDoc = {
    _id: 'foundId',
    toProfile: jest.fn(() => JSON.parse(JSON.stringify(MOCK_PROFILE))),
  }

  jest.spyOn(userService, 'findByUsername').mockImplementation(async () => foundUserDoc as any);
  jest.spyOn(userModel, 'findOneAndUpdate').mockImplementation(async () => { })

  const res = await service.unfollow('username2', 'id1');

  expect(userService.findByUsername).toHaveBeenCalledWith('username2');
  expect(userModel.findOneAndUpdate).toHaveBeenCalledWith({ _id: 'id1' }, { $pull: { following: 'foundId' }}, { new: true });
  expect(res).toEqual(JSON.parse(JSON.stringify(MOCK_PROFILE)));
})
});
