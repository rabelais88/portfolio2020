import getImageUrl from './getImageUrl';

const getThumbUrl = (filename) => {
  const url = getImageUrl(`preview-${filename}`);
  return url;
};

export default getThumbUrl;
