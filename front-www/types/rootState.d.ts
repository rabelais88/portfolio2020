import { defaultStateArticle } from './article';
import { defaultStateTag } from './tag';
import { defaultStateUi } from './ui';
import { defaultStatePost } from './postStore';

export interface defaultStateRoot {
  article: defaultStateArticle;
  tag: defaultStateTag;
  ui: defaultStateUi;
  post: defaultStatePost;
}
