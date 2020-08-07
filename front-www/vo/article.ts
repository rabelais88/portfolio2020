import _cloneDeep from 'lodash/cloneDeep';
import { article, articleResponse, tagResponse } from '../types/article';

export function mapArticle(__article: articleResponse): article {
  const _article = _cloneDeep(__article);
  let createdAt = -1;
  let updatedAt = -1;
  let deletedAt = -1;
  if (_article.createdAt && _article.createdAt !== '')
    createdAt = new Date(_article.createdAt).getTime();
  if (_article.updatedAt && _article.updatedAt !== '')
    updatedAt = new Date(_article.updatedAt).getTime();
  if (_article.deletedAt && _article.deletedAt !== '')
    deletedAt = new Date(_article.deletedAt).getTime();
  const a = {
    id: _article.id,
    type: _article.type,
    title: _article.title,
    desc: _article.desc,
    coverImage: _article.coverImage,
    link: _article.link,
    createdAt,
    updatedAt,
    deletedAt,
    tags: _article.tags.map((t) => t.value),
  };

  return a;
}
