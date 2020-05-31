import ARTICLE_TYPE from './articleType';

interface article {
  id: string;
  type: ARTICLE_TYPE;
  title: string;
  desc: string;
  coverImage: string;
}

export default article;
