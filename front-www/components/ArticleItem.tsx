import React from 'react';
import { Box, PseudoBox, Text, Heading } from '@chakra-ui/core';
import theme from 'components/chakraTheme';
import { date, getArticleUrl } from 'lib';
import { article } from 'types/article';

import { WORK, POST } from 'types/articleType';

const ArticleItem: React.FC<{ _article: article }> = (props) => {
  const { _article, ..._props } = props;
  if (_article.type === POST)
    return (
      <Box paddingBottom="10">
        <PseudoBox
          as="a"
          {...{ href: getArticleUrl(_article.id) }}
          role="group"
          fontSize="md"
          fontStyle="heading"
          _hover={{ textDecor: 'none' }}
        >
          <PseudoBox
            as="h2"
            _groupHover={{ color: theme.colors.point_teal }}
            transition=".2s"
          >
            <Text as="span" paddingRight="3" fontWeight="bolder">
              {_article.type}
            </Text>
            <Text as="span" fontWeight="normal">
              {_article.title}
            </Text>
          </PseudoBox>
        </PseudoBox>
        {_article.desc !== '' && <Text fontSize="sm">{_article.desc}</Text>}
        <Text color="placeholder" fontSize="sm">
          {date.formatPastDate(_article.updatedAt)}
        </Text>
      </Box>
    );

  if (_article.type === WORK)
    return (
      <Box paddingBottom="10">
        <PseudoBox
          as="a"
          {...{ href: _article.link }}
          role="group"
          fontSize="md"
          fontStyle="heading"
          _hover={{ textDecor: 'none' }}
        >
          <PseudoBox
            as="h2"
            _groupHover={{ color: theme.colors.point_teal }}
            transition=".2s"
          >
            <Text as="span" paddingRight="3" fontWeight="bolder">
              {_article.type}
            </Text>
            <Text as="span" fontWeight="normal">
              {_article.title}
            </Text>
          </PseudoBox>
        </PseudoBox>
        {_article.desc !== '' && <Text fontSize="sm">{_article.desc}</Text>}
        <Text color="placeholder" fontSize="sm">
          {date.formatPastDate(_article.updatedAt)}
        </Text>
      </Box>
    );
  return <Heading>unknown type</Heading>;
};

export default ArticleItem;
