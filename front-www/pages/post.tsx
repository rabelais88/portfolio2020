import React from 'react';
import { connect } from 'react-redux';

import wrapper from 'store/root';
import getArticleReducer from 'redux-getters/getArticleReducer';
import Logger from 'lib/logger';
import Layout from 'components/Layout';
import Markdown from 'components/Markdown';
import { getPost } from 'store/post/action';
import getPostStore from 'redux-getters/getPostReducer';
import { SUCCESS } from 'types/loadState';
import { Heading, Box, Text } from '@chakra-ui/core';
import getImageUrl from 'lib/getImageUrl';

const logger = new Logger('pages/post.tsx');

interface _PostPage {
  (): JSX.Element;
}

const PostPage: _PostPage = () => {
  const postStore = getPostStore();
  const { loadState, post } = postStore;

  const imageUrl = `url(${getImageUrl(post.coverImage)})`;

  return (
    <Layout>
      {post.coverImage === '' && (
        <>
          <Heading>{post.title}</Heading>
          <Text textShadow="sm" color="white" p="5">
            {post.desc}
          </Text>
        </>
      )}
      {post.coverImage !== '' && (
        <Box
          bgImage={imageUrl}
          bgPos="center"
          backgroundRepeat="no-repeat"
          bgSize="cover"
          height="200px"
        >
          <Heading color="white" textShadow="sm" p="5">
            {post.title}
          </Heading>
          <Text textShadow="sm" color="white" px="5">
            {post.desc}
          </Text>
        </Box>
      )}
      <Markdown>{post.content}</Markdown>
    </Layout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (props) => {
  const { query, store } = props;
  const state = store.getState();
  // const page = query.page as string;
  const articleId = query.id as string;
  logger.log({ articleId });
  await store.dispatch(getPost(articleId));
});

export default connect(null, null)(PostPage);
