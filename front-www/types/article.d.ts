import ARTICLE_TYPE_ENUM from './articleType';
import queryPaging from './queryPaging';

export interface tagResponse {
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  value: string;
  // articles should be extended
  // to avoid circular dependency
}

export interface tag {
  createdAt: number;
  updatedAt: number;
  deletedAt: number;
  value: string;
}

export interface articleResponse {
  id: string;
  type: ARTICLE_TYPE_ENUM;
  title: string;
  desc: string;
  coverImage: string;
  link: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  tags: tagResponse[];
}

// parsed article
export interface article {
  id: string;
  type: ARTICLE_TYPE_ENUM;
  title: string;
  desc: string;
  coverImage: string;
  link: string;
  createdAt: number;
  updatedAt: number;
  deletedAt: number;
  tags: string[];
}

export interface defaultStateArticle extends queryPaging {
  articles: article[];
  recentArticles: recentArticles[];
  articleType: ARTICLE_TYPE;
  count: number;
  pages: number[];
  page: number;
  loadState: LOAD_STATE;
  tag: string;
  keyword: string;
}
