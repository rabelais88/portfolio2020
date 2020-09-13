import React from 'react';
import Head from 'next/head';
import wrapper from 'store/root';
import { Logger, date } from 'lib';
import { Layout, Markdown } from 'components';
import { usePostStore } from 'redux-getters';
import { getPost } from 'store/post/action';
import { Heading, Box, Stack, Tag, Text } from '@chakra-ui/core';
import { useDispatch } from 'react-redux';
import { setArticlePage, setArticleTag } from 'store/article/action';
import { setMenuOpen } from 'store/ui/action';

const logger = new Logger('pages/article/[articleid].tsx');
const Article = (props) => {
  const { post } = usePostStore();
  const dispatch = useDispatch();

  const onTagClick = async (tag) => {
    await dispatch(setArticleTag(tag));
    await dispatch(setArticlePage(0));
    await dispatch(setMenuOpen(true));
  };

  return (
    <Layout>
      <Head>
        <title>sungryeol.com - {post.title}</title>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          property="og:title"
          content={`sungryeol - ${post.title}`}
          key="title"
          name="title"
        />
        <meta
          property="og:description"
          name="description"
          content="work, portfolio of sungryeol park"
          key="description"
        />
        <meta property="og:image" content="/memoji1.png" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="http://sungryeol.com" />
        <meta property="og:site_name" content="sungryeol's portfolio" />
      </Head>
      <Tag>
        <span
          role="img"
          aria-label="writing hand"
          style={{ paddingRight: '10px' }}
        >
          ✍️
        </span>
        Post
      </Tag>
      <Heading>{post.title}</Heading>
      <Text color="disabled" fontSize="sm">
        {date.formatPastDate(post.updatedAt)}
      </Text>
      <Box h="30px" />
      <Markdown>{post.content}</Markdown>
      <Box h="30px" />
      <Box>
        <Heading as="h3" size="sm" fontFamily="NotoSansKR">
          More on...
        </Heading>
        <Heading as="h3" size="sm" fontFamily="NotoSansKR">
          관련 글 보기
        </Heading>
      </Box>
      <Box h="30px" />
      <Stack direction="row" flexWrap="wrap" alignItems="space-between">
        {post.tags.map((p) => (
          <Box marginRight="2" marginBottom="2" key={p.value}>
            <Tag size="sm" cursor="pointer" onClick={() => onTagClick(p.value)}>
              {p.value}
            </Tag>
          </Box>
        ))}
      </Stack>
    </Layout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (props) => {
  const { query, store } = props;
  logger.log({ articleid: query.articleid });
  const articleId = query.articleid.toString();
  await store.dispatch(getPost(articleId));
});

export default Article;
