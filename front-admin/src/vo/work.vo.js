import _cloneDeep from 'lodash/cloneDeep';

export const mapWork = (work) => {
  const w = _cloneDeep(work);
  // p._title = article.title;
  // p._desc = article.desc;
  // p._link = article.link;
  // p._coverImage = article.coverImage;
  // p._postCreatedAt = article.createdAt;
  // p._tags = (p.article.tags || []).map(p => p.value);
  w._articleId = w.id;
  w._tags = (w.tags || []).map((t) => t.value);
  return w;
};
