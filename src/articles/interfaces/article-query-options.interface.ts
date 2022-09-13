export interface ArticleQueryOptions {
  query?: ArticleQueryParams;
  limit: number;
  offset: number;
}

export interface ArticleQueryParams {
  favorited?: string;
  author?: string;
  tag?: string;
}
