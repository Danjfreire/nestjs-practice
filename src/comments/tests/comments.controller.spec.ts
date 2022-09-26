import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from '../comments.controller';
import { CommentsService } from '../comments.service';
import { CommentJSON } from '../interfaces/comment.interface';

describe('CommentsController', () => {
  let controller: CommentsController;
  let commentService: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        { provide: CommentsService, useValue: { addComment: jest.fn(), getComments: jest.fn(), deleteComment: jest.fn() } }
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    commentService = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should add comment', async () => {
    const slug = 'slug';
    const commentDto = { body: 'comment' }
    const response: CommentJSON = {
      id: '1234',
      body: 'comment',
      createdAt: '2022-09-26T22:27:12.319Z',
      updatedAt: '2022-09-26T22:27:12.319Z',
      author: {
        bio: 'bio',
        following: true,
        image: 'imgurl',
        username: 'user'
      }
    }

    jest.spyOn(commentService, 'addComment').mockImplementation(async () => response);

    const res = await controller.addComment(slug, commentDto, { email: 'email@email.com', id: 'id', username: 'username' });

    expect(commentService.addComment).toHaveBeenCalledWith(commentDto, slug, 'id');
    expect(res).toEqual({ comment: response })
  });

  it('should get comments', async () => {
    const slug = 'slug';
    
    jest.spyOn(commentService, 'getComments').mockImplementation(async () => []);

    const res = await controller.getComments(slug, { email: 'email@email.com', id: 'id', username: 'username' });

    expect(commentService.getComments).toHaveBeenCalledWith(slug, 'id');
    expect(res).toEqual({comments : []});
  });

  it('should delete comment', async () => {
    
    jest.spyOn(commentService, 'deleteComment').mockImplementation(async () => {});

    await controller.deleteComment('cid', { email: 'email@email.com', id: 'id', username: 'username' });

    expect(commentService.deleteComment).toHaveBeenCalledWith('cid', 'id');
  });
});
