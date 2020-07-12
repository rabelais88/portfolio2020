import React from 'react';
import { connect } from 'react-redux';

import wrapper from 'store/root';
import getArticleReducer from 'redux-getters/getArticleReducer';
import { getArticles, setArticlePage } from 'store/article/action';
import Logger from 'lib/logger';
import checkNum from 'lib/checkNum';
import ArticleItem from 'components/ArticleItem';
import Layout from 'components/Layout';
import Paginator from 'components/Paginator';

const logger = new Logger('pages/index.tsx');

interface _HomePage {
  (): JSX.Element;
}

const HomePage: _HomePage = () => {
  const articleStore = getArticleReducer();
  const { articles, count, size, page } = articleStore;

  const articleList = articles.map((_article) => (
    <ArticleItem {..._article} key={_article.id} />
  ));

  function onPageClick(pageNum) {
    window.location.href = `/?page=${pageNum}`;
  }

  return (
    <Layout>
      {articleList}
      <Paginator
        count={count}
        size={size}
        page={page}
        onPageClick={onPageClick}
      />
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
