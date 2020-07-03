import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { GetServerSideProps } from 'next';
import getArticleReducer from '../redux-getters/getArticleReducer';
import { getArticles } from '../services/article';
import { getArticles as getArticlesAction } from '../actions/article';
import { mapArticle } from '../vo/article';
import { article } from '../types/article';
import Logger from '../lib/logger';

const logger = new Logger('pages/index.tsx');

interface Props {
  articlesServer: article[];
}

interface _HomePage {
  (arg: Props): JSX.Element;
}

const HomePage: _HomePage = ({ articlesServer }: Props) => {
  const dispatch = useDispatch();
  const articleStore = getArticleReducer();
  useEffect(() => {
    dispatch(getArticlesAction());
  }, []);
  useEffect(() => {}, [articlesServer]);

  return (
    <div>
      Welcome to Next.js!
      <div>store data: {JSON.stringify(articleStore.articles)}</div>
      <div>server data: {JSON.stringify(articlesServer)}</div>
    </div>
  );
};

// getStaticProps should be used for fetching ever-fixed article
export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const query = ctx.query || {};

  const props = { articlesServer: [] };
  const reqArticles = await getArticles({ page: query.page });
  if (reqArticles.error) {
    logger.log('request failed for reqArticles', reqArticles.error);
    return { props };
  }
  props.articlesServer = reqArticles.result.list.map(mapArticle);
  return { props };
};

export default HomePage;
