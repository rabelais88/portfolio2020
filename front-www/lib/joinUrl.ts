import qs from 'qs';
/**
 * @function joinUrl
 * @example
 * const url = joinUrl(['api', 'post'], {page: 1, pageSize: 10});
 * url === 'api/post?page=1&pageSize=10';
 * const urlB = joinUrl('myUrl', { service: 'aaa' });
 * urlB === 'myUrl?service=aaa';
 * const urlC = joinUrl(['abc','def']);
 * urlC === 'abc/def';
 */
// eslint-disable-next-line
function joinUrl(urls: string[] | string, query?: any): string {
  const url = typeof urls === 'string' ? urls : urls.join('/');
  if (!query) return url;
  const _query = qs.stringify(query);
  return `${url}?${_query}`;
}

export default joinUrl;
