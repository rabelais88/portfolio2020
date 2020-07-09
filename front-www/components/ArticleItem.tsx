import React from 'react';
import { Box, Image, Tag, TagLabel, Stack, Text } from '@chakra-ui/core';
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
  return (
    <Box display="flex" p={4}>
      <Box maxW="sm" maxH="sm" overflow="hidden">
        <Image src="https://via.placeholder.com/150" />
      </Box>
      <Box p={4}>
        <Box fontSize="md" fontWeight="semiBold" as="h4">
          {title}
        </Box>
        <Stack spacing={4} isInline>
          {tags.map((tag) => (
            <Tag size="sm" key={tag}>
              <TagLabel>{tag}</TagLabel>
            </Tag>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default ArticleItem;
