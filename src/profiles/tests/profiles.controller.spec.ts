import { Test, TestingModule } from '@nestjs/testing';
import { Profile } from '../interfaces/profile.model';
import { ProfilesController } from '../profiles.controller';
import { ProfilesService } from '../profiles.service';

describe('ProfilesController', () => {
  let controller: ProfilesController;
  let profileService: ProfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfilesController],
      providers: [
        { provide: ProfilesService, useValue: { findProfileByUsername: jest.fn(), follow: jest.fn(), unfollow: jest.fn() } }
      ]
    }).compile();

    controller = module.get<ProfilesController>(ProfilesController);
    profileService = module.get<ProfilesService>(ProfilesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find profile', async () => {
    const profile: Profile = {
      bio: 'bio',
      following: true,
      image: 'imageurl',
      username: 'username'
    }

    jest.spyOn(profileService, 'findProfileByUsername').mockImplementation(async () => profile);

    const res = await controller.findProfile('username', { email: 'email@email.com', id: 'id', username: 'username' });

    expect(profileService.findProfileByUsername).toHaveBeenLastCalledWith('username', 'id');
    expect(res).toEqual({ profile });
  });

  it('should follow profile', async () => {
    const profile: Profile = {
      bio: 'bio',
      following: true,
      image: 'imageurl',
      username: 'username2'
    }

    jest.spyOn(profileService, 'follow').mockImplementation(async () => profile);

    const res = await controller.followProfile('username2', { email: 'email@email.com', id: 'id', username: 'username' });

    expect(profileService.follow).toHaveBeenCalledWith('username2', 'id');
    expect(res).toEqual({profile});
  });

  it('should unfollow profile', async () => {
    const profile: Profile = {
      bio: 'bio',
      following: false,
      image: 'imageurl',
      username: 'username2'
    }

    jest.spyOn(profileService, 'unfollow').mockImplementation(async () => profile);

    const res = await controller.unfollowProfile('username2', { email: 'email@email.com', id: 'id', username: 'username' });

    expect(profileService.unfollow).toHaveBeenCalledWith('username2', 'id');
    expect(res).toEqual({profile});
  });

});
