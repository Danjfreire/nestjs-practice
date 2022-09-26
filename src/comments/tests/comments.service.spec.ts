import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { async } from 'rxjs';
import { ArticlesService } from '../../articles/articles.service';
import { ArticleDocument } from '../../articles/schemas/article.schema';
import { UsersService } from '../../users/users.service';
import { CommentsService } from '../comments.service';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { Comment } from '../schemas/comment.schema';

const MOCK_USER_DOC = {
  _id: 'user_id',
  email: 'email@email.com',
  username: 'username',
  following: [],
  favorites: [],
  bio: 'bio',
  image: 'image',
  password: 'hashedpassword'
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

const MOCK_COMMENT_JSON = {
  id: 'id',
  createdAt: '2011-10-05T14:48:00.000Z',
  updatedAt: '2011-10-05T14:48:00.000Z',
  body: 'body',
  author: {
    username: 'username',
    bio: 'bio',
    image: 'imageUrl',
    following: true
  }
}

describe('CommentsService', () => {
  let service: CommentsService;
  let articleService: ArticlesService;
  let usersService: UsersService;
  let commentModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        { provide: ArticlesService, useValue: { findArticle: jest.fn() } },
        { provide: UsersService, useValue: { findById: jest.fn() } },
        { provide: getModelToken(Comment.name), useValue: { find: jest.fn(), findOne: jest.fn(), create: jest.fn(), deleteOne: jest.fn() } }
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    articleService = module.get<ArticlesService>(ArticlesService);
    usersService = module.get<UsersService>(UsersService);
    commentModel = module.get(getModelToken(Comment.name));

    jest.useFakeTimers().setSystemTime(new Date('2011-10-05'))
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add comment', async () => {

    const commentDoc = {
      id: 'id',
      createdAt: '2011-10-05T14:48:00.000Z',
      updatedAt: '2011-10-05T14:48:00.000Z',
      populate: jest.fn(async () => ({ toJSON: jest.fn(() => JSON.parse(JSON.stringify(MOCK_COMMENT_JSON))) })),
    }

    const commentDto: CreateCommentDto = {
      body: 'body'
    }

    jest.spyOn(usersService, 'findById').mockImplementation(async () => JSON.parse(JSON.stringify(MOCK_USER_DOC)));
    jest.spyOn(articleService, 'findArticle').mockImplementation(async () => JSON.parse(JSON.stringify(MOCK_ARTICLE_DOC)));
    jest.spyOn(commentModel, 'create').mockImplementation(async () => commentDoc);

    const res = await service.addComment(commentDto, 'slug', 'userId');

    const now = new Date()

    expect(commentDoc.populate).toHaveBeenCalledWith('author');
    expect(commentModel.create).toHaveBeenCalledWith({ body: commentDto.body, article: 'article_id', author: 'user_id', createdAt: now.toISOString(), updatedAt: now.toISOString() })
    expect(res).toEqual(JSON.parse(JSON.stringify(MOCK_COMMENT_JSON)));
  })

  it('should handle error adding comment to an article that does not exist', async () => {

    const commentDto: CreateCommentDto = {
      body: 'body'
    }

    jest.spyOn(usersService, 'findById').mockImplementation(async () => JSON.parse(JSON.stringify(MOCK_USER_DOC)));
    jest.spyOn(articleService, 'findArticle').mockImplementation(async () => null);

    try {
      await service.addComment(commentDto, 'slug', 'userId')
      fail();
    } catch (error) {
      expect(error.message).toEqual('Article not found')
    }

  });

  it('should get comments', async () => {

    const commentDoc = {
      id: 'id',
      createdAt: '2011-10-05T14:48:00.000Z',
      updatedAt: '2011-10-05T14:48:00.000Z',
      toJSON: jest.fn(() => JSON.parse(JSON.stringify(MOCK_COMMENT_JSON))),
    }

    jest.spyOn(usersService, 'findById').mockImplementation(async () => JSON.parse(JSON.stringify(MOCK_USER_DOC)));
    jest.spyOn(articleService, 'findArticle').mockImplementation(async () => JSON.parse(JSON.stringify(MOCK_ARTICLE_DOC)));
    jest.spyOn(commentModel, 'find').mockImplementation(() => ({ populate: async () => [commentDoc] }));

    const res = await service.getComments('slug', 'id');

    expect(res).toEqual([MOCK_COMMENT_JSON]);
  })

  it('should delete comment', async () => {

    const comment = {
      id: 'id',
      createdAt: '2011-10-05T14:48:00.000Z',
      updatedAt: '2011-10-05T14:48:00.000Z',
      body: 'body',
      author: 'authorId'
    }

    jest.spyOn(commentModel, 'findOne').mockImplementation(async () => comment);
    jest.spyOn(commentModel, 'deleteOne').mockImplementation(async () => { });

    await service.deleteComment('commentId', 'authorId');

    expect(commentModel.deleteOne).toHaveBeenCalledWith({ _id: 'commentId' });
  })

  it('should handle error trying to delete a comment that does not exist', async () => {
    jest.spyOn(commentModel, 'findOne').mockImplementation(async () => null);

    try {
      await service.deleteComment('commentId', 'authorId');
      fail()
    } catch (error) {
      expect(error.message).toEqual('Comment not found');
    }
  })

  it('should handle error trying to delete a comment without permission', async () => {
    const comment = {
      id: 'id',
      createdAt: '2011-10-05T14:48:00.000Z',
      updatedAt: '2011-10-05T14:48:00.000Z',
      body: 'body',
      author: { toString: () => 'authorId2' }
    }

    jest.spyOn(commentModel, 'findOne').mockImplementation(async () => comment);

    try {
      await service.deleteComment('commentId', 'authorId');
      fail()
    } catch (error) {
      expect(error.message).toEqual('No permission to delete comment');
    }
  })

});
