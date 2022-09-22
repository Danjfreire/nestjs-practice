import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { async, distinct } from 'rxjs';
import { Article } from '../../articles/schemas/article.schema';
import { TagsService } from '../tags.service';

describe('TagsService', () => {
  let service: TagsService;
  let articleModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagsService,
        { provide: getModelToken(Article.name), useValue: { find: jest.fn() } }
      ],
    }).compile();

    service = module.get<TagsService>(TagsService);
    articleModel = module.get(getModelToken(Article.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all tags', async () => {
    const tags = ['tag1', 'tag2', 'tag3'];

    const findQuery = { distinct : jest.fn(() => ({exec : async () => tags}))}

    jest.spyOn(articleModel, 'find').mockImplementation(() => findQuery );

    const res = await service.findAll();

    expect(findQuery.distinct).toHaveBeenCalledWith('tagList');
    expect(res).toEqual(tags);
  })

  it('should handle error trying to retrieve all tags', async () => {
    test.todo
  });

});
