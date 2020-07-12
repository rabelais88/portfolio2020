import React, { useEffect, useRef } from 'react';
import { connect, useDispatch } from 'react-redux';
import getTagReducer from 'redux-getters/getTagReducer';

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
  const { loadState, tags } = tagStore;
  const tagVizContainerRef = useRef(null);
  useEffect(() => {
    dispatch(getTags());
  }, []);

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
        I am a frontend web developer specialized in data visualization. Both
        scientific and visually compelling stuffs attract my attention. As a
        brief showcase, this page has been specifically made more
        data-visualization focused.
      </Text>
      {loadState === LOADING && (
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      )}
      {loadState === SUCCESS && <TagViz tags={tags} />}
    </Layout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (props) => {
  const { query, store } = props;
  // blank
});

export default connect(null, null)(HomePage);
