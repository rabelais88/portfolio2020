import { article } from 'types/article';
import LOAD_STATE, { INIT } from 'types/loadState';

export interface postResponse {
  article: article;
  articleId: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface post extends article {
  content: string;
}

export interface defaultStatePost {
  post: post;
  loadState: LOAD_STATE;
}
