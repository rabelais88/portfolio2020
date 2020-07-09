import { defaultStateTag, tag } from 'types/tag';
import Logger from 'lib/logger';
import action from 'types/action';

const logger = new Logger('store/article/tag');

export const SET_TAGS = 'SET_TAGS';
type setTagsType = action<typeof SET_TAGS, tag[]>;
export const setTags = (tags: tag[]): setTagsType => ({
  type: SET_TAGS,
  payload: tags,
});

export type tagActionTypes = setTagsType;
