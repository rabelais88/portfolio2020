import _cloneDeep from 'lodash/cloneDeep';

export const mapPost = (post) => {
  const p = _cloneDeep(post);
  const article = p.article || {};
  p._title = article.title;
  p._desc = article.desc;
  p._link = article.link;
  p._coverImage = article.coverImage;
  p._postCreatedAt = article.createdAt;
  p._tags = (article.tags || []).map((t) => t.value);
  return p;
};
