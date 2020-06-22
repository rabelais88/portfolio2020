import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { GetServerSideProps } from 'next';
import getPostReducer from '../redux-getters/getPostReducer';
import getPosts, { getPostsRequest } from '../actions/getPosts';
import { getArticles } from '../services/article';
import { getArticles as getArticlesAction } from '../actions/article';
import post from '../types/post';
import article from '../types/article';
import setPosts from '../actions/setPosts';
import Logger from '../lib/logger';

const logger = new Logger('pages/index.tsx');

interface Props {
  postsServer: post[];
  articlesServer: article[];
}

interface _HomePage {
  (arg: Props): JSX.Element;
}

const HomePage: _HomePage = ({ postsServer }) => {
  const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(getPosts({ page: 1 }));
  // }, []);
  useEffect(() => {
    logger.log({ postsServer });
    dispatch(setPosts(postsServer));
    dispatch(getArticlesAction({ page: 1 }));
  }, [postsServer]);

  const postStore = getPostReducer();
  return (
    <div>
      Welcome to Next.js!
      <div>store data: {JSON.stringify(postStore.posts)}</div>
      <div>server data: {JSON.stringify(postsServer)}</div>
    </div>
  );
};

// getStaticProps should be used for fetching ever-fixed article
export const getServerSideProps: GetServerSideProps<Props> = async (arg) => {
  const reqPosts = await getPostsRequest({ page: 1 });
  const props = { postsServer: [], articlesServer: [] };
  if (reqPosts.error) {
    logger.log('request failed!');
    return { props };
  }
  props.postsServer = reqPosts.result;
  const reqArticles = await getArticles({ page: 0 });
  if (reqArticles.error) {
    logger.log('request failed for reqArticles', reqArticles.error);
    return { props };
  }
  props.articlesServer = reqArticles.result.list;
  return { props };
};

export default HomePage;
