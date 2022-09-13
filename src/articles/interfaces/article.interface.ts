import { Profile } from 'src/profiles/interfaces/profile.model';

export interface ArticleJSON {
  author: Profile;
  body: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  favoritesCount: number;
  favorited: boolean;
  slug: string;
  tagList: string[];
  title: string;
}

export interface ArticleRO {
  article: ArticleJSON;
}

export interface MultipleArticleRO {
  articlesCount: number;
  articles: ArticleJSON[];
}
