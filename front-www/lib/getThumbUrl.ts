import getImageUrl from './getImageUrl';

const getThumbUrl = (filename) => {
  const url = getImageUrl(filename);
  return `preview-${url}`;
};

export default getThumbUrl;
