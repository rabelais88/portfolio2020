import { IMAGE_URL } from 'env';

function getImageUrl(url: string): string {
  const re = new RegExp('(http|https)://.+', 'gi');
  if (re.test(url)) return url;
  return [IMAGE_URL, url].join('/');
}

export default getImageUrl;
