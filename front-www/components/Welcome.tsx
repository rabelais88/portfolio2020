import React from 'react';
import {
  Box,
  PseudoBox,
  Text,
  Flex,
  Heading,
  Image,
  Tag,
  Stack,
} from '@chakra-ui/core';
import { BrowserView, MobileView } from 'react-device-detect';
import theme from 'components/chakraTheme';
import { checkClient, Logger, date } from 'lib';
import { useUiStore, useArticleStore } from 'redux-getters';
import welcomeStyle from 'styles/welcome.module.css';
import wrapper from 'store/root';
import { getArticles } from 'store/article/action';
import { article } from 'types/article';

import FollowingLogo from './FollowingLogo';

const logger = new Logger('components/Welcome.tsx');

const TitleHeading = (props) => (
  <Box w="280px">
    <Text fontSize="72px" textShadow="sm" fontWeight="black" lineHeight="85px">
      박성렬
    </Text>
    <Heading
      fontSize="36px"
      textShadow="sm"
      fontWeight="black"
      fontStyle="heading"
      paddingBottom={8}
    >
      Portfolio.
    </Heading>
    <hr
      style={{
        borderBottom: 'solid 1px white',
        boxShadow: theme.shadows.sm,
      }}
    />
  </Box>
);

const Cover = () => (
  <>
    <PseudoBox
      w="100vw"
      h="100vh"
      top="0"
      left="0"
      right="0"
      zIndex={-1}
      position="absolute"
    >
      <PseudoBox
        style={{ backdropFilter: 'blur(50px) saturate(180%)' }}
        backgroundColor="rgba(196,196,196,.2)"
        color="white"
        w="full"
        h="full"
        position="absolute"
        zIndex={-2}
      />
      <PseudoBox
        bgImage="url('https://bit.ly/2jYM25F')"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        w="full"
        h="full"
        position="absolute"
        zIndex={-3}
      />
    </PseudoBox>
    <Box
      height="100vh"
      color="white"
      top="0"
      left="0"
      right="0"
      position="absolute"
    >
      <Box h={['10%', '10%']} />
      <Flex h={['30%', '20%']} justifyContent="center" w="100%">
        <TitleHeading />
      </Flex>
      <BrowserView
        style={{ width: '100%', height: '70%' }}
        viewClassName={welcomeStyle.welcomebottom}
      >
        <FollowingLogo width="100%" height="100%" style={{ zIndex: 3 }} />
      </BrowserView>
      <MobileView
        style={{
          width: '100%',
          height: '40%',
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          zIndex: 3,
        }}
        viewClassName={welcomeStyle.welcomebottom}
      >
        <Image src="/memoji2.png" width="200px" height="200px" />
      </MobileView>
    </Box>
  </>
);

const ArticleItem: React.FC<{ _article: article }> = (props) => {
  const { _article, ..._props } = props;
  return (
    <Box {...props}>
      <Heading fontSize="lg">
        <Text as="span" paddingRight="3">
          {_article.type}
        </Text>
        <Text as="span" fontWeight="lighter">
          {_article.title}
        </Text>
      </Heading>
      {_article.desc !== '' && <Text>{_article.desc}</Text>}
      <Text color="placeholder">{date.formatPastDate(_article.updatedAt)}</Text>
    </Box>
  );
};

const Welcome = () => {
  const isClient = checkClient();
  const articleStore = useArticleStore();
  const { articles } = articleStore;

  return (
    <>
      <Cover />
      <Box position="relative" top="100vh">
        <Heading as="h1">Recent Post</Heading>
        <Stack spacing={10} paddingTop={10}>
          {articles.map((a) => (
            <ArticleItem key={a.id} _article={a} />
          ))}
        </Stack>
      </Box>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (props) => {
  const { store } = props;
  // await store.dispatch(setSize)
  await store.dispatch(getArticles());
  logger.log(store.getState());
});

export default Welcome;
