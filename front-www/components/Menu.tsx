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
} from '@chakra-ui/core';
import {
  setArticleKeyword,
  getArticles,
  changeKeyword,
} from 'store/article/action';
import { useDispatch } from 'react-redux';
import Logger from 'lib/logger';
// import _debounce from 'lodash/debounce';

const logger = new Logger('components/Menu.tsx');

const Menu: React.FunctionComponent<unknown> = (props) => {
  const router = useRouter();
  const { keyword, tag } = useArticleStore();
  const dispatch = useDispatch();

  function onKeywordChange(event) {
    dispatch(changeKeyword(event.target.value));
  }

  return (
    <Grid templateColumns="1fr 6fr 1fr" gap="10px" width="100%" p={3}>
      <Flex align="center" justify="center">
        <Link href="/">About</Link>
      </Flex>
      <Flex align="center" justify="center">
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
