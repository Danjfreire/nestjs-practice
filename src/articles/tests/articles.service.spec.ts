import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { fail } from 'assert';
import { UsersService } from '../../users/users.service';
import { ArticlesService } from '../articles.service';
import { CreateArticleDto } from '../dto/create-article.dto';
import { ArticleJSON } from '../interfaces/article.interface';
import { Article } from '../schemas/article.schema';

const MOCK_USER_DOC = {
  _id: 'id',
  email: 'email@email.com',
  username: 'username',
  following: [],
  favorites: [],
  bio: 'bio',
  image: 'image',
  password: 'hashedpassword'
}

const MOCK_ARTICLE_JSON: ArticleJSON = {
  title: 'title',
  body: 'body',
  createdAt: '2022-09-27T16:04:54.084Z',
  updatedAt: '2022-09-27T16:04:54.084Z',
  description: 'description',
  favorited: false,
  slug: 'slug',
  tagList: ['tag1', 'tag2'],
  favoritesCount: 9,
  author: {
    bio: 'bio',
    following: true,
    image: 'imageUrl',
    username: 'username'
  }
}

const MOCK_ARTICLE_DOC = {
  _id: 'article_id',
  slug: 'slug',
  title: 'title',
  body: 'body',
  description: 'description',
  tagList: ['tag1', 'tag2'],
  createdAt: '2011-10-05T14:48:00.000Z',
  updatedAt: '2011-10-05T14:48:00.000Z',
  favorited: true,
  favoritesCount: 10,
}

describe('ArticlesService', () => {
  let service: ArticlesService;
  let usersService: UsersService;
  let articleModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        { provide: UsersService, useValue: { findByUsername: jest.fn(), findById: jest.fn(), addFavoriteArticle: jest.fn(), removeFavoriteArticle: jest.fn() } },
        { provide: getModelToken(Article.name), useValue: { create: jest.fn(), count: jest.fn(), find: jest.fn(), findOne: jest.fn() } }
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    usersService = module.get<UsersService>(UsersService);
    articleModel = module.get(getModelToken(Article.name));

    jest.useFakeTimers().setSystemTime(new Date('2011-10-05'))
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create article', async () => {
    const createArticleDto: CreateArticleDto = {
      body: 'body',
      description: 'description',
      tagList: ['tag1', 'tag2'],
      title: 'title'
    }

    const mockArticle = {
      title: 'title',
      body: 'body',
      createdAt: '2022-09-27T16:04:54.084Z',
      updatedAt: '2022-09-27T16:04:54.084Z',
      description: 'description',
      favorited: false,
      slug: 'slug',
      tagList: ['tag1', 'tag2'],
      favoritesCount: 9,
      populate: jest.fn(() => ({ toJSON: () => JSON.parse(JSON.stringify(MOCK_ARTICLE_JSON)) })),
    }

    jest.spyOn(usersService, 'findById').mockImplementation(async () => JSON.parse(JSON.stringify(MOCK_USER_DOC)));
    jest.spyOn(articleModel, 'create').mockImplementation(async () => mockArticle);

    const res = await service.createArticle('id', createArticleDto);

    expect(articleModel.create).toHaveBeenCalledWith(
      {
        ...createArticleDto,
        slug: 'title',
        author: 'id',
        createdAt: '2011-10-05T00:00:00.000Z',
        updatedAt: '2011-10-05T00:00:00.000Z',
        favoritesCount: 0
      });
    expect(res).toEqual(JSON.parse(JSON.stringify(MOCK_ARTICLE_JSON)));
  });

  it('should list articles', async () => {

    const populateFn = jest.fn(async () => ([{ toJSON: () => JSON.parse(JSON.stringify(MOCK_ARTICLE_JSON)) }]))
    const limitFn = jest.fn(() => ({ populate: populateFn }));
    const skipFn = jest.fn(() => ({ limit: limitFn }));
    const sortFn = jest.fn(() => ({ skip: skipFn }));
    const findFn = jest.fn(() => ({ sort: sortFn }));

    jest.spyOn(usersService, 'findByUsername').mockImplementation(async () => JSON.parse(JSON.stringify(MOCK_USER_DOC)));
    jest.spyOn(usersService, 'findById').mockImplementation(async () => null);
    jest.spyOn(articleModel, 'count').mockImplementation(() => ({ exec: async () => 1 }));
    jest.spyOn(articleModel, 'find').mockImplementation(findFn);

    const res = await service.listArticles({ limit: 10, offset: 0, query: { author: 'id', tag: 'tag1' } });

    expect(findFn).toHaveBeenCalledWith({ author: 'id', tagList: 'tag1' });
    expect(sortFn).toHaveBeenCalledWith({ createdAt: 'desc' });
    expect(skipFn).toHaveBeenCalledWith(0);
    expect(limitFn).toHaveBeenCalledWith(10);
    expect(populateFn).toHaveBeenCalledWith('author');
    expect(res).toEqual({ articlesCount: 1, articles: [JSON.parse(JSON.stringify(MOCK_ARTICLE_JSON))] });

  });

  it('should return empty response if author is not found', async () => {
    jest.spyOn(usersService, 'findByUsername').mockImplementation(async () => { throw new NotFoundException('User not found') });
    jest.spyOn(usersService, 'findById').mockImplementation(async () => null);

    const res = await service.listArticles({ limit: 10, offset: 0, query: { author: 'id', tag: 'tag1' } });

    expect(res).toEqual({ articlesCount: 0, articles: [] });
  });

  it('should get articles feed', async () => {
    const populateFn = jest.fn(async () => ([{ toJSON: () => JSON.parse(JSON.stringify(MOCK_ARTICLE_JSON)) }]))
    const limitFn = jest.fn(() => ({ populate: populateFn }));
    const skipFn = jest.fn(() => ({ limit: limitFn }));
    const sortFn = jest.fn(() => ({ skip: skipFn }));
    const findFn = jest.fn(() => ({ sort: sortFn }));

    jest.spyOn(usersService, 'findById').mockImplementation(async () => JSON.parse(JSON.stringify(MOCK_USER_DOC)));
    jest.spyOn(articleModel, 'count').mockImplementation(() => ({ exec: async () => 1 }));
    jest.spyOn(articleModel, 'find').mockImplementation(findFn);

    const res = await service.getArticlesFeed({ limit: 10, offset: 0, query: { author: 'id', tag: 'tag1' } }, 'id');

    expect(articleModel.count).toHaveBeenCalledWith({ author: { $in: [] } })
    expect(findFn).toHaveBeenCalledWith({ author: { $in: [] } });
    expect(sortFn).toHaveBeenCalledWith({ createdAt: 'desc' });
    expect(skipFn).toHaveBeenCalledWith(0);
    expect(limitFn).toHaveBeenCalledWith(10);
    expect(populateFn).toHaveBeenCalledWith('author');
    expect(res).toEqual({ articlesCount: 1, articles: [JSON.parse(JSON.stringify(MOCK_ARTICLE_JSON))] });
  });

  it('should find article', async () => {
    jest.spyOn(articleModel, 'findOne').mockImplementation(async () => JSON.parse(JSON.stringify(MOCK_ARTICLE_DOC)));

    const res = await service.findArticle('slug');

    expect(articleModel.findOne).toHaveBeenCalledWith({ slug: 'slug' });
    expect(res).toEqual(JSON.parse(JSON.stringify(MOCK_ARTICLE_DOC)))
  });

  it('should get article', async () => {

    const mockArticle = {
      title: 'title',
      body: 'body',
      createdAt: '2022-09-27T16:04:54.084Z',
      updatedAt: '2022-09-27T16:04:54.084Z',
      description: 'description',
      favorited: false,
      slug: 'slug',
      tagList: ['tag1', 'tag2'],
      favoritesCount: 9,
      populate: jest.fn(() => ({ toJSON: () => JSON.parse(JSON.stringify(MOCK_ARTICLE_JSON)) })),
    }

    jest.spyOn(usersService, 'findById').mockImplementation(async () => JSON.parse(JSON.stringify(MOCK_USER_DOC)));
    jest.spyOn(service, 'findArticle').mockImplementation(async () => mockArticle as any);

    const res = await service.getArticle('slug', 'id');

    expect(res).toEqual(JSON.parse(JSON.stringify(MOCK_ARTICLE_JSON)))
  });

  it('should update article', async () => {
    const mockArticle = {
      title: 'title',
      body: 'body',
      createdAt: '2022-09-27T16:04:54.084Z',
      updatedAt: '2022-09-27T16:04:54.084Z',
      description: 'description',
      favorited: false,
      slug: 'slug',
      tagList: ['tag1', 'tag2'],
      favoritesCount: 9,
      author: { toString: () => 'id' },
      populate: jest.fn(async () => ({ toJSON: () => JSON.parse(JSON.stringify(MOCK_ARTICLE_JSON)) })),
      save: jest.fn(async () => mockArticle),
    }

    jest.spyOn(usersService, 'findById').mockImplementation(async () => JSON.parse(JSON.stringify(MOCK_USER_DOC)));
    jest.spyOn(articleModel, 'findOne').mockImplementation(async () => mockArticle);

    const res = await service.updateArticle('slug', { title: 'updated title' }, 'id');

    expect(mockArticle.save).toHaveBeenCalledTimes(1);
    expect(mockArticle.populate).toHaveBeenCalledWith('author');
    expect(res).toEqual(JSON.parse(JSON.stringify(MOCK_ARTICLE_JSON)));
  });

  it('should throw error if different user tries to update article', async () => {

    const mockUser = {
      _id: 'differentId',
    }

    const mockArticle = {
      title: 'title',
      body: 'body',
      createdAt: '2022-09-27T16:04:54.084Z',
      updatedAt: '2022-09-27T16:04:54.084Z',
      description: 'description',
      favorited: false,
      slug: 'slug',
      tagList: ['tag1', 'tag2'],
      favoritesCount: 9,
      author: { toString: () => 'id' },
      populate: jest.fn(async () => ({ toJSON: () => JSON.parse(JSON.stringify(MOCK_ARTICLE_JSON)) })),
      save: jest.fn(async () => mockArticle),
    }

    jest.spyOn(usersService, 'findById').mockImplementation(async () => JSON.parse(JSON.stringify(mockUser)));
    jest.spyOn(articleModel, 'findOne').mockImplementation(async () => mockArticle);

    try {
      const res = await service.updateArticle('slug', { title: 'updated title' }, 'id');
      fail();
    } catch (error) {
      expect(error.message).toEqual('User does not have access to article');
    }
  });

  it('should delete article', async () => {
    const mockArticle = {
      author: { toString: () => 'id' },
      delete: jest.fn(async () => { }),
    }

    jest.spyOn(usersService, 'findById').mockImplementation(async () => JSON.parse(JSON.stringify(MOCK_USER_DOC)));
    jest.spyOn(articleModel, 'findOne').mockImplementation(async () => mockArticle);

    await service.deleteArticle('slug', 'id');

    expect(mockArticle.delete).toHaveBeenCalled();
  });

  it('should handle error trying to delete article', async () => {
    const mockUser = {
      _id: 'differentId',
    }

    const mockArticle = {
      author: { toString: () => 'id' },
      delete: jest.fn(async () => { }),
    }

    jest.spyOn(usersService, 'findById').mockImplementation(async () => mockUser as any);
    jest.spyOn(articleModel, 'findOne').mockImplementation(async () => mockArticle);

    try {
      await service.deleteArticle('slug', 'id');
      fail();
    } catch (error) {
      expect(error.message).toEqual('User does not have access to article')
    }

  })

  it('should favorite article', async () => {
    const mockArticle = {
      title: 'title',
      body: 'body',
      createdAt: '2022-09-27T16:04:54.084Z',
      updatedAt: '2022-09-27T16:04:54.084Z',
      description: 'description',
      favorited: false,
      slug: 'slug',
      tagList: ['tag1', 'tag2'],
      favoritesCount: 9,
      author: { toString: () => 'id' },
      populate: jest.fn(async () => ({
        toJSON: () => ({
          title: mockArticle.title,
          body: mockArticle.body,
          createdAt: mockArticle.createdAt,
          updatedAt: mockArticle.updatedAt,
          description: mockArticle.description,
          favorited: mockArticle.favorited,
          slug: mockArticle.slug,
          tagList: mockArticle.tagList,
          favoritesCount: mockArticle.favoritesCount,
          author: {
            bio: 'bio',
            following: true,
            image: 'imageUrl',
            username: 'username'
          }
        })
      })),
      save: jest.fn(async () => mockArticle),
    }

    jest.spyOn(usersService, 'findById').mockImplementation(async () => JSON.parse(JSON.stringify(MOCK_USER_DOC)));
    jest.spyOn(articleModel, 'findOne').mockImplementation(async () => mockArticle);
    jest.spyOn(usersService, 'addFavoriteArticle').mockImplementation(async () => JSON.parse(JSON.stringify(MOCK_USER_DOC)));

    const res = await service.favoriteArticle('slug', 'id');

    expect(mockArticle.save).toHaveBeenCalled();
    expect(mockArticle.populate).toHaveBeenCalledWith('author');
    expect(res).toEqual({
      title: 'title',
      body: 'body',
      createdAt: '2022-09-27T16:04:54.084Z',
      updatedAt: '2022-09-27T16:04:54.084Z',
      description: 'description',
      favorited: false,
      slug: 'slug',
      tagList: ['tag1', 'tag2'],
      favoritesCount: 10,
      author: {
        bio: 'bio',
        following: true,
        image: 'imageUrl',
        username: 'username'
      }
    });
  });

  it('should throw error if article is not found trying to favorite', async () => {
    jest.spyOn(usersService, 'findById').mockImplementation(async () => JSON.parse(JSON.stringify(MOCK_USER_DOC)));
    jest.spyOn(articleModel, 'findOne').mockImplementation(async () => null);

    try {
      await service.favoriteArticle('slug', 'id');
      fail();
    } catch (error) {
      expect(error.message).toEqual('Article not found');
    }
  });

  it('should throw error if article is already favorited', async () => {
    const mockArticle = {
      _id : 'articleId'
    };

    const mockUser = {
      _id : 'id',
      favorites : [
        'articleId'
      ]
    };

    jest.spyOn(usersService, 'findById').mockImplementation(async () => mockUser as any);
    jest.spyOn(articleModel, 'findOne').mockImplementation(async () => mockArticle);

    try {
      await service.favoriteArticle('slug', 'id');
      fail();
    } catch (error) {
      expect(error.message).toEqual('Article already favorited')
    }
  })

  it('should unfavorite article', async () => {

    const mockUser = {
      _id : 'id',
      favorites : ['articleId']
    };

    const mockArticle = {
      _id : 'articleId',
      title: 'title',
      body: 'body',
      createdAt: '2022-09-27T16:04:54.084Z',
      updatedAt: '2022-09-27T16:04:54.084Z',
      description: 'description',
      favorited: false,
      slug: 'slug',
      tagList: ['tag1', 'tag2'],
      favoritesCount: 9,
      author: { toString: () => 'id' },
      populate: jest.fn(async () => ({
        toJSON: () => ({
          title: mockArticle.title,
          body: mockArticle.body,
          createdAt: mockArticle.createdAt,
          updatedAt: mockArticle.updatedAt,
          description: mockArticle.description,
          favorited: mockArticle.favorited,
          slug: mockArticle.slug,
          tagList: mockArticle.tagList,
          favoritesCount: mockArticle.favoritesCount,
          author: {
            bio: 'bio',
            following: true,
            image: 'imageUrl',
            username: 'username'
          }
        })
      })),
      save: jest.fn(async () => mockArticle),
    }

    jest.spyOn(usersService, 'findById').mockImplementation(async () => mockUser as any);
    jest.spyOn(articleModel, 'findOne').mockImplementation(async () => mockArticle);
    jest.spyOn(usersService, 'removeFavoriteArticle').mockImplementation(async () => JSON.parse(JSON.stringify(MOCK_USER_DOC)));

    const res = await service.unfavoriteArticle('slug', 'id');

    expect(mockArticle.save).toHaveBeenCalled();
    expect(mockArticle.populate).toHaveBeenCalledWith('author');
    expect(res).toEqual({
      title: 'title',
      body: 'body',
      createdAt: '2022-09-27T16:04:54.084Z',
      updatedAt: '2022-09-27T16:04:54.084Z',
      description: 'description',
      favorited: false,
      slug: 'slug',
      tagList: ['tag1', 'tag2'],
      favoritesCount: 8,
      author: {
        bio: 'bio',
        following: true,
        image: 'imageUrl',
        username: 'username'
      }
    });
  });

  it('should throw error if article is not found trying to unfavorite', async () => {
    jest.spyOn(usersService, 'findById').mockImplementation(async () => JSON.parse(JSON.stringify(MOCK_USER_DOC)));
    jest.spyOn(articleModel, 'findOne').mockImplementation(async () => null);

    try {
      await service.unfavoriteArticle('slug', 'id');
      fail();
    } catch (error) {
      expect(error.message).toEqual('Article not found');
    }
  });

  it('should throw error if article is not favorited', async () => {
    const mockArticle = {
      _id : 'articleId'
    };

    const mockUser = {
      _id : 'id',
      favorites : []
    };

    jest.spyOn(usersService, 'findById').mockImplementation(async () => mockUser as any);
    jest.spyOn(articleModel, 'findOne').mockImplementation(async () => mockArticle);

    try {
      await service.unfavoriteArticle('slug', 'id');
      fail();
    } catch (error) {
      expect(error.message).toEqual('Article is not favorited by user')
    }
  })
  
});
