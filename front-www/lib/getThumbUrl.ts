import { IMAGE_URL } from 'env';

const getThumbUrl = (url) => {
  const re = new RegExp('(http|https)://.+', 'gi');
  if (re.test(url)) return url;
  return [IMAGE_URL, `preview-${url}`].join('/');
  return url;
};

export default getThumbUrl;
