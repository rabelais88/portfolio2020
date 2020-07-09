import React, { useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';

import wrapper from 'store/root';
import getArticleReducer from 'redux-getters/getArticleReducer';
import { getArticles, setArticlePage } from 'store/article/action';
import { article } from 'types/article';
import Logger from 'lib/logger';
import checkNum from 'lib/checkNum';
import ArticleItem from 'components/ArticleItem';
import Layout from 'components/Layout';

const logger = new Logger('pages/index.tsx');

interface _HomePage {
  (): JSX.Element;
}

const HomePage: _HomePage = () => {
  const dispatch = useDispatch();
  const articleStore = getArticleReducer();
  const { articles } = articleStore;

  const articleList = articles.map((_article) => (
    <ArticleItem {..._article} key={_article.id} />
  ));

  return (
    <Layout>
      {/* <div>store data: {JSON.stringify(articleStore)}</div> */}
      {articleList}
    </Layout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (props) => {
  const { query, store } = props;
  const state = store.getState();
  const page = query.page as string;
  if (state.article.page !== query.page && checkNum(page)) {
    const _page = parseInt(page, 10);
    await store.dispatch(setArticlePage(_page));
  }
  await store.dispatch(getArticles());
  logger.log(store.getState());
});

export default connect(null, null)(HomePage);
