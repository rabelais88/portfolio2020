import _pickBy from 'lodash/pickBy';
import { api, asyncResolver, resolvedResult } from 'lib/api';
import { Logger, joinUrl } from 'lib';
import { tag } from 'types/tag';

const logger = new Logger('services/article.ts');

export const TAGS = 'tags';

export interface getTagsRequestArg {
  keyword?: string;
  limit?: number;
}

export interface tagsResponse {
  tags: tag[];
}

export async function getTags(
  arg?: getTagsRequestArg
): Promise<resolvedResult<tagsResponse>> {
  const _arg = _pickBy(
    arg,
    (value, key) => value !== '' && value !== 0 && value
  );
  const url = joinUrl(TAGS, _arg);
  const opts = {
    method: 'get',
    url: `/${url}`,
  };
  logger.log('getTags()', { opts });
  const req = await asyncResolver<tagsResponse>(api.request, opts);
  return req;
}
