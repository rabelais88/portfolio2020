/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import _pickBy from 'lodash/pickBy'

import getArticleReducer from '../redux-getters/getArticleReducer';
import { getArticles } from '../services/article';
import { getArticles as getArticlesAction } from '../actions/article';
import { mapArticle } from '../vo/article';
import { article } from '../types/article';
import Logger from '../lib/logger';
import checkNum from '../lib/checkNum';

const logger = new Logger('pages/index.tsx');

interface Props {
  articles: article[];
  page: number;
  size: number;
  keyword: string;
  tag: string;
}

interface _HomePage {
  (arg: Props): JSX.Element;
}

const HomePage: _HomePage = ({ articles, page, size, keyword, tag }: Props) => {
  const dispatch = useDispatch();
  const articleStore = getArticleReducer();
  useEffect(() => {
    dispatch(getArticlesAction());
  }, []);
  useEffect(() => {}, [articles]);

  return (
    <div>
      Welcome to Next.js!
      <div>store data: {JSON.stringify(articleStore.articles)}</div>
      <div>server data: {JSON.stringify(articles)}</div>
    </div>
  );
};

interface contextQuery extends ParsedUrlQuery {
  page?: string | string[];
  size?: string | string[];
  keyword?: string | string[];
  tag?: string | string[];
}

// getStaticProps should be used for fetching ever-fixed article
export const getServerSideProps: GetServerSideProps<
  Props,
  contextQuery
> = async (ctx: GetServerSidePropsContext<contextQuery>) => {
  const props = { articles: [], page: 1, keyword: '', tag: '', size: 10 };
  const query = ctx.query || {};
  if (typeof query.page !== 'string' || !checkNum(query.page)) {
    ctx.res.statusCode = 302;
    ctx.res.setHeader('Location', '/?page=1');
    ctx.res.end();
    return { props };
  }

  const qry = { page: parseInt(query.page, 10) };

  const reqArticles = await getArticles(qry);
  if (reqArticles.error) {
    logger.log('request failed for reqArticles', reqArticles.error);
    return { props };
  }
  props.articles = reqArticles.result.list.map(mapArticle);
  return { props };
};

export default HomePage;
