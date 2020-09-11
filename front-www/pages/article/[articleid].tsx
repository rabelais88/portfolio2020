import React from 'react';
import wrapper from 'store/root';
import { Logger, date } from 'lib';
import { Layout, Markdown } from 'components';
import { usePostStore } from 'redux-getters';
import { getPost } from 'store/post/action';
import { Heading, Box, Stack, Tag, Text } from '@chakra-ui/core';

const logger = new Logger('pages/article/[articleid].tsx');
const Article = (props) => {
  const { post } = usePostStore();
  return (
    <Layout>
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
      <Stack direction="row">
        {post.tags.map((p) => (
          <Tag size="sm" key={p.value}>
            {p.value}
          </Tag>
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
