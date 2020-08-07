import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useArticleStore, useUiStore } from 'redux-getters';
import {
  Grid,
  Link,
  Input,
  InputGroup,
  InputRightElement,
  Icon,
  Flex,
  Heading,
  IconButton,
  Drawer,
  Button,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  List,
  ListIcon,
  ListItem,
} from '@chakra-ui/core';
import {
  changeKeyword,
  setArticleType,
  getArticles,
} from 'store/article/action';
import { useDispatch } from 'react-redux';
import Logger from 'lib/logger';
// import _debounce from 'lodash/debounce';
import { useScrollPosition } from '@n8tb1t/use-scroll-position';
import { setMenuOpen } from 'store/ui/action';
import { POST, WORK, ALL } from 'types/articleType';

const logger = new Logger('components/Menu.tsx');

const getKeywordUrl = (keyword) => `/?keyword=${keyword}`;
const getTypeUrl = (articleType) => `/?type=${articleType}`;

const Menu: React.FunctionComponent<unknown> = (props) => {
  const router = useRouter();
  const menuRef = useRef(null);
  const { keyword, tag } = useArticleStore();
  const { menuOpen } = useUiStore();
  const [scroll, setScroll] = useState(0);
  const dispatch = useDispatch();

  function onKeywordChange(event) {
    dispatch(changeKeyword(event.target.value));
  }

  useScrollPosition(({ prevPos, currPos }) => {
    if (currPos.y !== prevPos.y) setScroll(currPos.y);
    logger.log({ currPos, prevPos });
  });

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (router.pathname !== '/') window.location.href = getKeywordUrl(keyword);
  };

  const onSearchClear = (e: React.FormEvent) => {
    e.preventDefault();
    if (router.pathname !== '/') window.location.href = '/';
    dispatch(changeKeyword(''));
  };

  const onKeyUp = (ev: React.KeyboardEvent) => {
    if (ev.key !== 'Enter') return null;
    window.location.href = getKeywordUrl(keyword);
    return null;
  };

  const articleSearchBox = (
    <InputGroup size="sm" width="100%" maxW="500px">
      <Input
        variant="flushed"
        placeholder="find articles or tags"
        value={keyword}
        onChange={onKeywordChange}
        onKeyUp={onKeyUp}
      />
      <InputRightElement>
        {keyword !== '' && (
          <IconButton
            aria-label="reset"
            icon="small-close"
            variant="unstyled"
            onClick={onSearchClear}
          />
        )}
        <IconButton
          aria-label="search"
          icon="search"
          variant="unstyled"
          onClick={onSearch}
        />
      </InputRightElement>
    </InputGroup>
  );

  const opts: { boxShadow?: 'md' } = {};
  if (scroll < 0) opts.boxShadow = 'md';

  async function onTypeClick(articleType) {
    logger.log({ articleType });
    await dispatch(setArticleType(articleType));
    await dispatch(getArticles());
    await dispatch(setMenuOpen(false));
    if (router.pathname !== '/') {
      window.location.href = getTypeUrl(articleType);
      return null;
    }
    const query = { type: articleType, page: 1 };
    if (articleType === ALL) delete query.type;
    router.push({ pathname: '/', query });
    return null;
  }

  const DrawerItem = ({ text, articleType }) => (
    <ListItem>
      <Button onClick={() => onTypeClick(articleType)} variant="unstyled">
        <ListIcon icon="chevron-right" />
        {text}
      </Button>
    </ListItem>
  );

  const DrawerMenu = () => (
    <Drawer
      isOpen={menuOpen}
      placement="right"
      onClose={() => dispatch(setMenuOpen(false))}
      finalFocusRef={menuRef}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerBody>
          <List spacing={3}>
            <DrawerItem text="list everything" articleType={ALL} />
            <DrawerItem text="all writings" articleType={POST} />
            <DrawerItem text="all code works" articleType={WORK} />
          </List>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );

  return (
    <>
      <DrawerMenu />
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
        {router.pathname === '/about' && (
          <Flex align="center" justify="center">
            <Link href="/">Articles</Link>
          </Flex>
        )}
        <Flex align="center" justify="center">
          {['/', '/post'].includes(router.pathname) && articleSearchBox}
          {router.pathname === '/about' && (
            <Heading as="h2" size="md">
              About
            </Heading>
          )}
        </Flex>
        <Flex align="center" justify="center">
          <IconButton
            icon="chevron-left"
            aria-label="open menu"
            onClick={() => dispatch(setMenuOpen(true))}
          />
        </Flex>
      </Grid>
    </>
  );
};

export default Menu;
