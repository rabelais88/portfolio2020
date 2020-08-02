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
import getImageUrl from 'lib/getImageUrl';

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
  const isTagOmitted = uiStore.viewWidth <= 700 && tags.length > tagLimit;
  let _tags = tags;
  if (uiStore.viewWidth <= 700) _tags = tags.slice(0, tagLimit);
  const tagList = _tags.map((tag) => (
    <Link key={tag} href={`/?tag=${tag}`}>
      <Tag size="sm">
        <TagLabel>{tag}</TagLabel>
      </Tag>
    </Link>
  ));

  const imageUrl = `url(${getImageUrl(coverImage)})`;
  const url = getUrl(props);

  const _coverImage = (
    <Box
      bgImage={imageUrl}
      bgPos="center"
      backgroundRepeat="no-repeat"
      bgSize="cover"
      minW={['80px', '110px']}
      height={['90px', '110px']}
    >
      <Badge variant="solid">{_type}</Badge>
    </Box>
  );

  return (
    <Flex overflowY="hidden" borderTopWidth="1px" overflowX="hidden">
      {coverImage !== '' && _coverImage}
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
          {isTagOmitted && (
            <Tag size="sm">
              <TagLabel>{`+${tags.length - tagLimit}`}</TagLabel>
            </Tag>
          )}
        </Stack>
      </Box>
    </Flex>
  );
};

export default ArticleItem;
