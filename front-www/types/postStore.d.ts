import { article, tag } from 'types/article';
import LOAD_STATE, { INIT } from 'types/loadState';

interface articleOnPost {
  id: string;
  title: string;
  desc: string;
  coverImage: string;
  tags: tags[];
  link: string;
}

export interface postResponse {
  article: articleOnPost;
  articleId: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface post {
  id: string;
  title: string;
  desc: string;
  coverImage: string;
  link: string;
  type: string;
  createdAt: number;
  updatedAt: number;
  deletedAt: number;
  content: string;
  tags: tag[];
}

export interface defaultStatePost {
  post: post;
  loadState: LOAD_STATE;
}
