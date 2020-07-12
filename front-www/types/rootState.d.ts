import { defaultStateArticle } from './article';
import { defaultStateTag } from './tag';
import { defaultStateUi } from './ui';

export interface defaultStateRoot {
  article: defaultStateArticle;
  tag: defaultStateTag;
  ui: defaultStateUi;
}
