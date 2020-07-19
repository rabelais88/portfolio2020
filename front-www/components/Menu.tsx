import React, { useState } from 'react';
import { useRouter } from 'next/router';
import useArticleStore from 'redux-getters/getArticleReducer';
import {
  Grid,
  Link,
  Input,
  InputGroup,
  InputRightElement,
  Icon,
  Flex,
  Heading,
} from '@chakra-ui/core';
import { changeKeyword } from 'store/article/action';
import { useDispatch } from 'react-redux';
import Logger from 'lib/logger';
// import _debounce from 'lodash/debounce';
import { useScrollPosition } from '@n8tb1t/use-scroll-position';

const logger = new Logger('components/Menu.tsx');

const Menu: React.FunctionComponent<unknown> = (props) => {
  const router = useRouter();
  const { keyword, tag } = useArticleStore();
  const [scroll, setScroll] = useState(0);
  const dispatch = useDispatch();

  function onKeywordChange(event) {
    dispatch(changeKeyword(event.target.value));
  }

  useScrollPosition(({ prevPos, currPos }) => {
    if (currPos.y !== prevPos.y) setScroll(currPos.y);
  });

  const articleSearchBox = (
    <InputGroup size="sm" width="100%" maxW="500px">
      <Input
        variant="flushed"
        placeholder="find articles or tags"
        value={keyword}
        onChange={onKeywordChange}
      />
      <InputRightElement>
        <Icon name="search" />
      </InputRightElement>
    </InputGroup>
  );

  const opts: { boxShadow?: 'md' } = {};
  if (scroll < 0) opts.boxShadow = 'md';

  return (
    <Grid
      backgroundColor="white"
      templateColumns="1fr 6fr 1fr"
      gap="10px"
      width="100%"
      p={3}
      position="fixed"
      top="0"
      left="0"
      right="0"
      height="60px"
      {...opts}
    >
      {router.pathname !== '/about' && (
        <Flex align="center" justify="center">
          <Link href="/about">About</Link>
        </Flex>
      )}
      {router.pathname !== '/' && (
        <Flex align="center" justify="center">
          <Link href="/">Articles</Link>
        </Flex>
      )}
      <Flex align="center" justify="center">
        {router.pathname === '/' && articleSearchBox}
        {router.pathname === '/about' && (
          <Heading as="h2" size="md">
            About
          </Heading>
        )}
      </Flex>
      <Flex align="center" justify="center">
        <Link href="/contact">
          <Icon name="email" aria-label="to contact page" />
        </Link>
      </Flex>
    </Grid>
  );
};

export default Menu;
