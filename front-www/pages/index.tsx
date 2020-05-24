import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { GetServerSideProps } from 'next';
import getPostReducer from '../redux-getters/getPostReducer';
import getPosts, { getPostsRequest } from '../actions/getPosts';
import posts from '../types/post';
import setPosts from '../actions/setPosts';
import Logger from '../lib/logger';

const logger = new Logger('pages/index.tsx');

interface Props {
  postsServer: posts[];
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
  if (reqPosts.error) {
    logger.log('request failed!');
    return { props: { postsServer: [] } };
  }
  return { props: { postsServer: reqPosts.result } };
};

export default HomePage;
