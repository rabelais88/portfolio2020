import ARTICLE_TYPE_ENUM from './articleType';

interface article {
  id: string;
  type: ARTICLE_TYPE_ENUM;
  title: string;
  desc: string;
  coverImage: string;
  link: string;
}

export default article;
