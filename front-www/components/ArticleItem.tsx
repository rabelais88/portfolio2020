import React from 'react';
import {
  Box,
  Tag,
  TagLabel,
  Stack,
  Badge,
  Flex,
  Link,
  Text,
} from '@chakra-ui/core';
import { article } from 'types/article';
import getUiStore from 'redux-getters/getUiReducer';
import { POST } from 'types/articleType';

type ArticleItemProps = article;

const getUrlByType = {
  DEFAULT: (props: ArticleItemProps) => props.link,
  [POST]: (props: ArticleItemProps) => `/post?id=${props.id}`,
};

const getUrl = (props: ArticleItemProps) => {
  if (!getUrlByType[props.type]) return getUrlByType.DEFAULT(props);
  return getUrlByType[props.type](props);
};

const ArticleItem: React.FunctionComponent<ArticleItemProps> = (props) => {
  const {
    id,
    type: _type,
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
  const url = getUrl(props);

  return (
    <Flex rounded="lg" borderWidth="1px" overflowY="hidden" marginY="2">
      <Box
        bgImage={imageUrl}
        bgPos="center"
        backgroundRepeat="no-repeat"
        bgSize="cover"
        width={['80px', '110px']}
        height={['90px', '110px']}
      >
        <Badge variant="solid">{_type}</Badge>
      </Box>
      <Box p={[2, 4]}>
        <Box paddingBottom={2}>
          <Link
            fontSize="md"
            fontWeight="bold"
            backgroundColor="white"
            href={url}
          >
            {title}
          </Link>
          <Text fontSize="xs">{desc}</Text>
        </Box>
        <Stack spacing={4} isInline overflowX="hidden">
          {tagList}
        </Stack>
      </Box>
    </Flex>
  );
};

export default ArticleItem;
