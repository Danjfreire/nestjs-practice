import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesController } from '../articles.controller';
import { ArticlesService } from '../articles.service';
import { CreateArticleDto } from '../dto/create-article.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';
import { ArticleJSON } from '../interfaces/article.interface';

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

describe('ArticlesController', () => {
  let controller: ArticlesController;
  let articleService: ArticlesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [
        {
          provide: ArticlesService, useValue: {
            createArticle: jest.fn(),
            getArticlesFeed: jest.fn(),
            getArticle: jest.fn(),
            listArticles: jest.fn(),
            updateArticle: jest.fn(),
            deleteArticle: jest.fn(),
            favoriteArticle: jest.fn(),
            unfavoriteArticle: jest.fn(),
          }
        }
      ]
    }).compile();

    controller = module.get<ArticlesController>(ArticlesController);
    articleService = module.get<ArticlesService>(ArticlesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should should create article', async () => {
    const createArticleDto: CreateArticleDto = {
      body: 'body',
      description: 'description',
      tagList: ['tag1', 'tag2'],
      title: 'title'
    }

    jest.spyOn(articleService, 'createArticle').mockImplementation(async () => JSON.parse(JSON.stringify(MOCK_ARTICLE_JSON)));

    const res = await controller.createArticle({ email: 'email@email.com', id: 'id', username: 'username' }, createArticleDto);

    expect(articleService.createArticle).toHaveBeenCalledWith('id', createArticleDto);
    expect(res).toEqual({ article: JSON.parse(JSON.stringify(MOCK_ARTICLE_JSON)) });
  })

  it('should get feed', async () => {
    jest.spyOn(articleService, 'getArticlesFeed').mockImplementation(async () => ({ articles: [JSON.parse(JSON.stringify(MOCK_ARTICLE_JSON))], articlesCount: 1 }));

    const res = await controller.getFeed(20, 0, { email: 'email@email.com', id: 'id', username: 'username' });

    expect(articleService.getArticlesFeed).toHaveBeenCalledWith({ limit: 20, offset: 0 }, 'id');
    expect(res).toEqual({ articles: [JSON.parse(JSON.stringify(MOCK_ARTICLE_JSON))], articlesCount: 1 });
  })

  it('should get article by slug', async () => {
    jest.spyOn(articleService, 'getArticle').mockImplementation(async () => JSON.parse(JSON.stringify(MOCK_ARTICLE_JSON)));

    const res = await controller.getArticle({ email: 'email@email.com', id: 'id', username: 'username' }, 'slug');

    expect(articleService.getArticle).toHaveBeenCalledWith('slug', 'id');
    expect(res).toEqual({ article: JSON.parse(JSON.stringify(MOCK_ARTICLE_JSON)) })
  })

  it('should list articles', async () => {
    jest.spyOn(articleService, 'listArticles').mockImplementation(async () => ({ articles: [JSON.parse(JSON.stringify(MOCK_ARTICLE_JSON))], articlesCount: 1 }));

    const res = await controller.listArticles('tag1', 'id', 'true', 20, 0, { email: 'email@email.com', id: 'id', username: 'username' });

    expect(articleService.listArticles).toHaveBeenCalledWith({ query: { tag: 'tag1', author: 'id', favorited: 'true' }, limit: 20, offset: 0 }, 'id');
    expect(res).toEqual({ articles: [JSON.parse(JSON.stringify(MOCK_ARTICLE_JSON))], articlesCount: 1 })
  })

  it('should update article', async () => {
    const updateDto: UpdateArticleDto = {
      title: 'title'
    };

    jest.spyOn(articleService, 'updateArticle').mockImplementation(async () => JSON.parse(JSON.stringify(MOCK_ARTICLE_JSON)));

    const res = await controller.updateArticle('slug', updateDto, { email: 'email@email.com', id: 'id', username: 'username' });

    expect(articleService.updateArticle).toHaveBeenCalledWith('slug', updateDto, 'id');
    expect(res).toEqual({ article: JSON.parse(JSON.stringify(MOCK_ARTICLE_JSON)) })
  })

  it('should delete article', async () => {
    jest.spyOn(articleService, 'deleteArticle').mockImplementation(async () => { });

    await controller.deleteArticle('slug', { email: 'email@email.com', id: 'id', username: 'username' });

    expect(articleService.deleteArticle).toHaveBeenCalledWith('slug', 'id');
  })

  it('should favorite article', async () => {
    jest.spyOn(articleService, 'favoriteArticle').mockImplementation(async () => JSON.parse(JSON.stringify(MOCK_ARTICLE_JSON)));

    const res = await controller.favoriteArticle('slug', { email: 'email@email.com', id: 'id', username: 'username' });

    expect(articleService.favoriteArticle).toHaveBeenCalledWith('slug', 'id');
    expect(res).toEqual({ article: JSON.parse(JSON.stringify(MOCK_ARTICLE_JSON)) })
  })

  it('should unfavorite article', async () => {
    jest.spyOn(articleService, 'unfavoriteArticle').mockImplementation(async () => JSON.parse(JSON.stringify(MOCK_ARTICLE_JSON)));

    const res = await controller.unfavoriteArticle('slug', { email: 'email@email.com', id: 'id', username: 'username' });

    expect(articleService.unfavoriteArticle).toHaveBeenCalledWith('slug', 'id');
    expect(res).toEqual({ article: JSON.parse(JSON.stringify(MOCK_ARTICLE_JSON)) })
  })
});
