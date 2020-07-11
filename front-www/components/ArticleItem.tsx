import React from 'react';
import { Box, Tag, TagLabel, Stack, Badge, Flex, Text } from '@chakra-ui/core';
import { article } from 'types/article';
import getUiStore from 'redux-getters/getUiReducer';

type ArticleItemProps = article;

const ArticleItem: React.FunctionComponent<ArticleItemProps> = (props) => {
  const {
    id,
    type,
    title,
    desc,
    coverImage,
    link,
    createdAt,
    updatedAt,
    deletedAt,
    tags,
  } = props;

  const tagLimit = 2;
  const uiStore = getUiStore();
  let _tags = tags;
  if (uiStore.viewWidth <= 700) {
    _tags = tags.slice(0, tagLimit);
    if (tags.length > tagLimit) _tags.push(`+${tags.length - tagLimit}`);
  }
  const tagList = _tags.map((tag) => (
    <Tag size="sm" key={tag}>
      <TagLabel>{tag}</TagLabel>
    </Tag>
  ));

  const imageUrl = `url(${coverImage})`;
  return (
    <Flex rounded="lg" borderWidth="1px" overflowY="hidden">
      <Box
        bgImage={imageUrl}
        bgPos="center"
        backgroundRepeat="no-repeat"
        bgSize="cover"
        width="100px"
        height="100px"
      >
        <Badge variant="solid">{type}</Badge>
      </Box>
      <Box p={4}>
        <Box paddingBottom={2}>
          <Text fontSize="md" fontWeight="bold" backgroundColor="white" as="h4">
            {title}
          </Text>
        </Box>
        <Stack spacing={4} isInline overflowX="hidden">
          {tagList}
        </Stack>
      </Box>
    </Flex>
  );
};

export default ArticleItem;
