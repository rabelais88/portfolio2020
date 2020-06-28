import _cloneDeep from 'lodash/cloneDeep';

export const mapArticle = (_article) => {
  const a = _cloneDeep(_article);
  a._createdAt = new Date(a.createdAt).getTime();
  a._updatedAt = new Date(a.updatedAt).getTime();
  a._tags = _article.tags.map((t) => t.value);
  return a;
};

export const mapArticlesById = (_articles) => {
  const results = {}; // because 'as' is a reserved word
  _articles.forEach((a) => {
    const _a = mapArticle(a);
    results[_a.id] = _a;
  });
  return results;
};
