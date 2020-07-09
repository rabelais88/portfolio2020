import React from 'react';
import { Box, Tag, TagLabel, Stack, PseudoBox } from '@chakra-ui/core';
import { article } from 'types/article';

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

  const tagList = tags.map((tag) => (
    <Tag size="sm" key={tag}>
      <TagLabel>{tag}</TagLabel>
    </Tag>
  ));

  const imageUrl = `url(${coverImage})`;
  return (
    <Box py="2">
      <Box
        bgImage={imageUrl}
        bgPos="center"
        backgroundRepeat="no-repeat"
        bgSize="cover"
        rounded="lg"
        borderWidth="1px"
      >
        <Box
          fontSize="md"
          fontWeight="bold"
          as="h4"
          backgroundColor="white"
          p={4}
        >
          [{type}]{title}
          <Stack spacing={4} isInline overflowX="hidden">
            {tagList}
          </Stack>
        </Box>
        <Box height="40px" />
      </Box>
    </Box>
  );
};

export default ArticleItem;
