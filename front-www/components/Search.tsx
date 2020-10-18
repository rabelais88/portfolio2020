import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useArticleStore, useTagStore, useUiStore } from 'redux-getters';
import { Z_BLOCKER, Z_SEARCH } from 'constants/zIndex';
import {
  Heading,
  Box,
  Icon,
  Stack,
  Text,
  Tag,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Input,
  PseudoBox,
  InputGroup,
  InputRightElement,
  Button,
  TagLabel,
  TagCloseButton,
} from '@chakra-ui/core';
import { useDispatch } from 'react-redux';
import {
  changeSearchKeyword,
  changeSearchMode,
  setMenuOpen,
  setSearchMode,
} from 'store/ui/action';
import {
  getArticles,
  getArticlesDebounced,
  setArticleKeyword,
  setArticlePage,
  setArticleTag,
  setArticleType,
} from 'store/article/action';
import { date, getArticleUrl, useIsDarkMode } from 'lib';
import { getTags, getTagsDebounced, setTagKeyword } from 'store/tag/action';
import {
  SEARCH_ALL,
  SEARCH_ARTICLE,
  SEARCH_TAG,
  SEARCH_WORK,
} from 'constants/searchMode';

import { Paginator, FullSpinner, TagViz } from 'components';
import { WORK, POST, ALL } from 'types/articleType';
import { LOADING, SUCCESS } from 'types/loadState';
import theme from './chakraTheme';

const MotionIcon = motion.custom(Icon);
const MotionBox = motion.custom(Box);

// only "variants" work with parent-children animation
const containerVariants: Variants = {
  enter: {
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.05,
    },
  },
  exit: {},
};

const childVariants: Variants = {
  enter: {
    x: 0,
    opacity: 1,
  },
  exit: {
    x: 20,
    opacity: 0,
  },
};

const MotionStack = motion.custom(Stack);

const InsideLayout = () => {
  const articleStore = useArticleStore();
  const uiStore = useUiStore();
  const dispatch = useDispatch();
  const tagStore = useTagStore();
  const isDarkMode = useIsDarkMode();

  const onPageClick = async (pageNum) => {
    await dispatch(setArticlePage(pageNum));
    await dispatch(getArticles());
  };

  const FoundArticles = () => {
    return (
      <>
        <MotionStack variants={containerVariants}>
          {articleStore.count === 0 && (
            <MotionBox>No articles including the keyword</MotionBox>
          )}
          {articleStore.articles.map((a) => (
            <MotionBox key={a.id} variants={childVariants}>
              <PseudoBox
                as="a"
                {...{ href: a.type === WORK ? a.link : getArticleUrl(a.id) }}
                role="group"
                _hover={{ textDecor: 'none' }}
              >
                <PseudoBox
                  _groupHover={{ color: theme.colors.point_teal }}
                  as="h2"
                  fontSize={['sm', 'md']}
                  fontFamily={theme.fonts.heading}
                >
                  {a.type === WORK && (
                    <span
                      role="img"
                      aria-label="linking chains"
                      style={{ paddingRight: '10px' }}
                    >
                      🔗
                    </span>
                  )}
                  {a.type === POST && (
                    <span
                      role="img"
                      aria-label="writing hand"
                      style={{ paddingRight: '10px' }}
                    >
                      ✍️
                    </span>
                  )}
                  <span>{a.title}</span>
                </PseudoBox>
              </PseudoBox>
              <Text fontSize={['xs', 'sm']} color="placeholder">
                {date.formatPastDate(a.updatedAt)}
              </Text>
            </MotionBox>
          ))}
        </MotionStack>
        <Paginator
          count={articleStore.count}
          size={articleStore.size}
          page={articleStore.page}
          onPageClick={onPageClick}
        />
      </>
    );
  };

  const onTagClick = async (tag) => {
    await dispatch(setArticleTag(tag));
    await dispatch(changeSearchMode(SEARCH_ARTICLE));
  };
  const FoundTags = () => {
    return (
      <MotionStack
        flexWrap="wrap"
        direction="row"
        alignItems="space-between"
        variants={containerVariants}
      >
        {tagStore.tags.length === 0 && (
          <MotionBox>No tags including the keyword</MotionBox>
        )}
        {tagStore.tags.map((t) => (
          <MotionBox
            key={t.tag}
            paddingRight="3"
            paddingBottom="3"
            variants={childVariants}
          >
            <Tag onClick={() => onTagClick(t.tag)} size="sm" cursor="pointer">
              {t.tag}
            </Tag>
          </MotionBox>
        ))}
      </MotionStack>
    );
  };

  const onKeywordChange = async (ev) => {
    // check wrong events
    const { value } = ev.target;
    await dispatch(changeSearchKeyword(value));
  };

  const onRemoveTag = async () => {
    await dispatch(setArticleTag(''));
    await dispatch(getArticles());
  };

  const onSearchClick = () => {
    if (uiStore.searchMode === SEARCH_TAG) getTagsDebounced(dispatch);
    else getArticlesDebounced(dispatch);
  };

  const tabIndices = [SEARCH_ALL, SEARCH_ARTICLE, SEARCH_WORK, SEARCH_TAG];
  return (
    <>
      <MotionIcon
        cursor="pointer"
        name="close"
        color={isDarkMode ? 'white' : 'black'}
        style={{
          WebkitFilter: 'drop-shadow(5px 5px 5px #222)',
          filter: 'drop-shadow(5px 5px 5px #222)',
        }}
        onClick={() => dispatch(setMenuOpen(false))}
        whileHover={{ scale: 1.5 }}
      />
      <Heading fontSize="md">Search</Heading>
      <InputGroup size="sm">
        <Input
          variant="flushed"
          placeholder="type keyword to search..."
          onChange={onKeywordChange}
          value={
            uiStore.searchMode === SEARCH_TAG
              ? tagStore.keyword
              : articleStore.keyword
          }
        />
        <InputRightElement w="5rem">
          <Button h="1.4rem" w="auto" size="sm" onClick={onSearchClick}>
            Search
          </Button>
        </InputRightElement>
      </InputGroup>
      <Box height={[3, 10]} />
      {articleStore.tag !== '' && (
        <Tag onClick={onRemoveTag} cursor="pointer" size="sm">
          <TagLabel>{articleStore.tag}</TagLabel>
          <TagCloseButton />
        </Tag>
      )}
      <Box height={[3, 10]} />
      <Tabs
        index={tabIndices.findIndex((v) => v === uiStore.searchMode)}
        onChange={(idx) => dispatch(changeSearchMode(tabIndices[idx]))}
      >
        <TabList>
          <Tab>All</Tab>
          <Tab>Articles</Tab>
          <Tab>Works</Tab>
          <Tab>Tags</Tab>
        </TabList>
        <TabPanels>
          <TabPanel h="full">
            <Box height={[3, 10]} />
            {articleStore.loadState === LOADING && <FullSpinner fullMode />}
            {articleStore.loadState === SUCCESS && <FoundArticles />}
          </TabPanel>
          <TabPanel h="full">
            <Box height={[3, 10]} />
            {articleStore.loadState === LOADING && <FullSpinner fullMode />}
            {articleStore.loadState === SUCCESS && <FoundArticles />}
          </TabPanel>
          <TabPanel h="full">
            <Box height={[3, 10]} />
            {articleStore.loadState === LOADING && <FullSpinner fullMode />}
            {articleStore.loadState === SUCCESS && <FoundArticles />}
          </TabPanel>
          <TabPanel h="full">
            <Box height={[3, 10]} />
            {tagStore.loadState === LOADING && <FullSpinner fullMode />}
            {tagStore.loadState === SUCCESS && <FoundTags />}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

const Search = () => {
  const uiStore = useUiStore();
  const menuWidthMin = 400;
  const menuWidth = Math.max(menuWidthMin, uiStore.viewWidth / 2);
  const isDarkMode = useIsDarkMode();

  const menuBGvariant: Variants = {
    enter: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x: menuWidth,
      opacity: 0,
    },
  };

  return (
    <AnimatePresence>
      {uiStore.menuOpen && (
        <MotionBox
          as="nav"
          key="search"
          backgroundColor={isDarkMode ? 'black' : 'white'}
          style={{
            position: 'fixed',
            bottom: 0,
            top: 0,
            right: 0,
            float: 'right',
            zIndex: Z_SEARCH,
            width: menuWidth,
          }}
          variants={menuBGvariant}
          initial="exit"
          animate="enter"
          exit="exit"
        >
          <Box p={10}>
            <InsideLayout />
          </Box>
        </MotionBox>
      )}
    </AnimatePresence>
  );
};

export default Search;
