import React from 'react';
import { connect, useDispatch } from 'react-redux';

import wrapper from 'store/root';
import getArticleReducer from 'redux-getters/getArticleReducer';
import {
  getArticles,
  setArticlePage,
  setArticleTag,
  setArticleKeyword,
  setArticleType,
} from 'store/article/action';
import Logger from 'lib/logger';
import checkNum from 'lib/checkNum';
import ArticleItem from 'components/ArticleItem';
import Layout from 'components/Layout';
import Paginator from 'components/Paginator';
import { Text, IconButton, Flex } from '@chakra-ui/core';
import { useRouter } from 'next/router';
import ARTICLE_TYPE, { ALL } from 'types/articleType';

const logger = new Logger('pages/index.tsx');

interface _HomePage {
  (): JSX.Element;
}

const HomePage: _HomePage = () => {
  const articleStore = getArticleReducer();
  const { articles, count, size, page, tag } = articleStore;
  const dispatch = useDispatch();
  const router = useRouter();

  const articleList = articles.map((_article) => (
    <ArticleItem {..._article} key={_article.id} />
  ));

  function onPageClick(pageNum) {
    window.location.href = `/?page=${pageNum}`;
  }

  async function onRemoveTag() {
    await dispatch(setArticleTag(''));
    await dispatch(getArticles());
    const query = { ...router.query };
    delete query.tag;
    router.push({ pathname: '/', query });
  }

  return (
    <Layout>
      {tag !== '' && (
        <Flex align="center">
          <IconButton
            size="sm"
            icon="small-close"
            onClick={onRemoveTag}
            aria-label="reset tag"
            variant="unstyled"
          />
          <Text>
            articles with <b>{tag}</b> tag({count})
          </Text>
        </Flex>
      )}
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
  const keyword = (query.keyword as string) || '';
  const articleType = (query.type as ARTICLE_TYPE) || ALL;
  if (state.article.articleType !== articleType) {
    await store.dispatch(setArticleType(articleType));
  }
  if (state.article.keyword !== keyword) {
    await store.dispatch(setArticleKeyword(keyword));
  }
  if (`${state.article.page}` !== query.page && checkNum(page)) {
    const _page = parseInt(page, 10);
    await store.dispatch(setArticlePage(_page));
  }
  const qtag = query.tag as string;
  if (state.article.tag !== qtag && qtag) {
    await store.dispatch(setArticleTag(qtag));
  }
  await store.dispatch(getArticles());
  logger.log(store.getState());
});

export default connect(null, null)(HomePage);
