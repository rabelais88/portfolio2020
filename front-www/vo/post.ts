import { postResponse, post } from 'types/postStore';
import _cloneDeep from 'lodash/cloneDeep';
import { POST } from 'types/articleType';

export function mapPost(_postResponse: postResponse): post {
  const p = _cloneDeep(_postResponse);

  let createdAt = -1;
  let updatedAt = -1;
  let deletedAt = -1;
  if (p.createdAt && p.createdAt !== '')
    createdAt = new Date(p.createdAt).getTime();
  if (p.updatedAt && p.updatedAt !== '')
    updatedAt = new Date(p.updatedAt).getTime();
  if (p.deletedAt && p.deletedAt !== '')
    deletedAt = new Date(p.deletedAt).getTime();

  const { article } = p;
  const _p = {
    // merge with article
    id: article.id,
    title: article.title,
    desc: article.desc,
    coverImage: article.coverImage,
    tags: article.tags,
    link: article.link,

    type: POST,
    content: p.content,
    createdAt,
    updatedAt,
    deletedAt,
  };

  return _p;
}
