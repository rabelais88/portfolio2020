import React, { useEffect, useRef } from 'react';
import { connect, useDispatch } from 'react-redux';
import getTagReducer from 'redux-getters/getTagReducer';
import getUiReducer from 'redux-getters/getUiReducer';

import { tag } from 'types/tag';
import wrapper from 'store/root';
import Logger from 'lib/logger';
import Layout from 'components/Layout';
import { Heading, Box, Flex, Text, Spinner } from '@chakra-ui/core';
import { SUCCESS, LOADING } from 'types/loadState';

import { getTags } from 'store/tag/action';
import TagViz from 'components/TagViz';

const logger = new Logger('pages/about.tsx');

interface _HomePage {
  (): JSX.Element;
}

const HomePage: _HomePage = () => {
  const dispatch = useDispatch();
  const tagStore = getTagReducer();
  const uiStore = getUiReducer();
  const { loadState, tags } = tagStore;
  useEffect(() => {
    dispatch(getTags());
  }, []);

  const onTagClick = (tagData: tag) => {
    window.location.href = `/?tag=${tagData.tag}`;
  };

  return (
    <Layout>
      <Flex align="center" justify="center" py="10">
        <Box>
          <Heading>Hi, I am Sungryeol Park</Heading>
          <Heading as="h3" size="lg">
            안녕하세요, 박성렬입니다
          </Heading>
        </Box>
      </Flex>
      <Text>
        I am a <b>frontend web developer</b> specialized in&nbsp;
        <b>data visualization.</b> Anything that&apos;s scientific or visually
        compelling stuffs attract my attention. As a brief showcase, this page
        has been specifically made more data-visualization focused.
      </Text>
      <Box p="4">
        <Heading
          as="h3"
          size="md"
          textAlign="center"
          marginTop="10"
          marginBottom="10"
        >
          Tags sorted by frequency
        </Heading>
        <Text>*click to see all articles related with the tags</Text>
        {loadState === LOADING && (
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        )}
        {loadState === SUCCESS && (
          <TagViz tags={tags} onMouseClick={onTagClick} />
        )}
      </Box>
    </Layout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (props) => {
  const { query, store } = props;
  // blank
});

export default connect(null, null)(HomePage);
