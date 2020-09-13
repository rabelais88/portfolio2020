import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
} from '@chakra-ui/core';
import { useDispatch } from 'react-redux';
import { setMenuOpen, setSearchMode } from 'store/ui/action';
import {
  getArticles,
  getArticlesDebounced,
  setArticleKeyword,
  setArticlePage,
  setArticleTag,
} from 'store/article/action';
import { date, getArticleUrl } from 'lib';
import { getTags, getTagsDebounced, setTagKeyword } from 'store/tag/action';
import { SEARCH_ARTICLE, SEARCH_TAG } from 'constants/searchMode';
import { Paginator } from 'components';
import { WORK, POST } from 'types/articleType';
import theme from './chakraTheme';

const InsideLayout = () => {
  const articleStore = useArticleStore();
  const uiStore = useUiStore();
  const dispatch = useDispatch();

  useEffect(() => {
    if (uiStore.menuOpen) {
      if (uiStore.searchMode === SEARCH_ARTICLE) dispatch(getArticles());
      else dispatch(getTags());
    }
  }, [uiStore.menuOpen, uiStore.searchMode]);

  const onPageClick = async (pageNum) => {
    await dispatch(setArticlePage(pageNum));
    await dispatch(getArticles());
  };

  const FoundArticles = () => {
    return (
      <>
        <Stack>
          {articleStore.articles.map((a) => (
            <Box key={a.id}>
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
                  {a.title}
                </PseudoBox>
              </PseudoBox>
              <Text fontSize={['xs', 'sm']} color="placeholder">
                {date.formatPastDate(a.updatedAt)}
              </Text>
            </Box>
          ))}
        </Stack>
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
    await dispatch(setSearchMode(SEARCH_ARTICLE));
  };
  const FoundTags = () => {
    const tagStore = useTagStore();
    return (
      <Stack flexWrap="wrap" direction="row" alignItems="space-between">
        {tagStore.tags.map((t) => (
          <Box key={t.tag} paddingRight="3" paddingBottom="3">
            <Tag onClick={() => onTagClick(t.tag)} size="sm" cursor="pointer">
              {t.tag}
            </Tag>
          </Box>
        ))}
      </Stack>
    );
  };

  const onKeywordChange = async (ev) => {
    // check wrong events
    const { value } = ev.target;
    await dispatch(setArticleKeyword(value));
    await dispatch(setTagKeyword(value));
    if (uiStore.searchMode === SEARCH_ARTICLE)
      await getArticlesDebounced(dispatch);
    else if (uiStore.searchMode === SEARCH_TAG)
      await getTagsDebounced(dispatch);
  };

  const onRemoveTag = async () => {
    await dispatch(setArticleTag(''));
    await dispatch(getArticles());
  };
  const tabIndices = [SEARCH_ARTICLE, SEARCH_TAG];
  return (
    <>
      <Icon
        cursor="pointer"
        name="close"
        color="black"
        style={{
          WebkitFilter: 'drop-shadow(5px 5px 5px #222)',
          filter: 'drop-shadow(5px 5px 5px #222)',
        }}
        onClick={() => dispatch(setMenuOpen(false))}
      />
      <Heading fontSize="md">Search</Heading>
      <Input
        variant="flushed"
        placeholder="type keyword to search..."
        onChange={onKeywordChange}
      />
      <Box height={[3, 10]} />
      {articleStore.tag !== '' && (
        <Tag onClick={onRemoveTag} cursor="pointer">
          <Icon name="small-close" color="black" />
          {articleStore.tag}
        </Tag>
      )}
      <Box height={[3, 10]} />
      <Tabs
        index={tabIndices.findIndex((v) => v === uiStore.searchMode)}
        onChange={(idx) => dispatch(setSearchMode(tabIndices[idx]))}
      >
        <TabList>
          <Tab>Articles</Tab>
          <Tab>Tags</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Box height={[3, 10]} />
            <FoundArticles />
          </TabPanel>
          <TabPanel>
            <Box height={[3, 10]} />
            <FoundTags />
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

  return (
    <AnimatePresence>
      {uiStore.menuOpen && (
        <motion.div
          key="blocker"
          style={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            zIndex: Z_BLOCKER,
            position: 'fixed',
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
      {uiStore.menuOpen && (
        <motion.nav
          key="search"
          style={{
            backgroundColor: theme.colors.white,
            position: 'fixed',
            bottom: 0,
            top: 0,
            right: 0,
            zIndex: Z_SEARCH,
          }}
          initial={{
            width: 0,
          }}
          transition={{ duration: 0.2 }}
          animate={{
            width: menuWidth,
          }}
          exit={{
            width: 0,
          }}
        >
          <Box p={10}>
            <InsideLayout />
          </Box>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default Search;
