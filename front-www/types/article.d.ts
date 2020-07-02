import ARTICLE_TYPE_ENUM from './articleType';
import tag from './tag';

// for article and work
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
  tags: tag[];
}

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

export interface postResponse {
  articleId: string;
  article: articleResponse;
  content: string;
}
