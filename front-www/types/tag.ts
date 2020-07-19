import LOAD_STATE from 'types/loadState';

// tag as article-independent datum
export interface tag {
  tag: string;
  articleCount: number;
}

export interface defaultStateTag {
  tags: tag[];
  keyword: string;
  limit: number;
  loadState: LOAD_STATE;
}
