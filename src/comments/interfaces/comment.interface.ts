import { Profile } from '../../profiles/interfaces/profile.model';

export interface CommentJSON {
  id: string;
  createdAt: string;
  updatedAt: string;
  body: string;
  author: Profile;
}

export interface CommentRO {
  comment: CommentJSON;
}

export interface MultipleCommentRO {
  comments: CommentJSON[];
}
