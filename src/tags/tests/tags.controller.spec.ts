import { Test, TestingModule } from '@nestjs/testing';
import { TagsController } from '../tags.controller';
import { TagsService } from '../tags.service';

describe('TagsController', () => {
  let controller: TagsController;
  let tagService : TagsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagsController],
      providers: [{ provide: TagsService, useValue: { findAll: jest.fn() } }],
    }).compile();

    controller = module.get<TagsController>(TagsController);
    tagService = module.get<TagsService>(TagsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find all tags', async () => {
    const tags = ['tag1', 'tag2' , 'tag3'];

    jest.spyOn(tagService, 'findAll').mockImplementation(async () => tags);

    const res = await controller.findAll();

    expect(tagService.findAll).toHaveBeenCalledTimes(1);
    expect(res).toEqual({tags});
  })
});
