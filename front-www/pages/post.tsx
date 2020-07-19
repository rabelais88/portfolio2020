import React from 'react';
import { connect } from 'react-redux';

import wrapper from 'store/root';
import getArticleReducer from 'redux-getters/getArticleReducer';
import Logger from 'lib/logger';
import Layout from 'components/Layout';
import { getPost } from 'services/article';

const logger = new Logger('pages/post.tsx');

interface _PostPage {
  (): JSX.Element;
}

const PostPage: _PostPage = () => {
  const articleStore = getArticleReducer();
  const { articles, count, size, page } = articleStore;

  return <Layout></Layout>;
};

export const getServerSideProps = wrapper.getServerSideProps(async (props) => {
  const { query, store } = props;
  const state = store.getState();
  // const page = query.page as string;
  const articleId = query.id as string;
  logger.log({ articleId });
  const req = await getPost(articleId);
  if (req.error) {
    return;
  }
  logger.log({ result: req.result });
  // if (`${state.article.page}` !== query.page && checkNum(page)) {
  //   const _page = parseInt(page, 10);
  //   await store.dispatch(setArticlePage(_page));
  // }
  // const qtag = query.tag as string;
  // if (state.article.tag !== qtag && qtag) {
  //   await store.dispatch(setArticleTag(qtag));
  // }
  // await store.dispatch(getArticles());
  // logger.log(store.getState());
});

export default connect(null, null)(PostPage);
