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
  Link,
} from '@chakra-ui/core';
import { BrowserView, MobileView } from 'react-device-detect';
import theme from 'components/chakraTheme';
import { checkClient, Logger, date } from 'lib';
import { useUiStore, useArticleStore } from 'redux-getters';
import welcomeStyle from 'styles/welcome.module.css';
import wrapper from 'store/root';
import { getArticles } from 'store/article/action';
import { article } from 'types/article';

import { WORK, POST } from 'types/articleType';
import FollowingLogo from './FollowingLogo';

const logger = new Logger('components/Welcome.tsx');

// move to production cloudfront later
const bgUrl = 'https://d2sqdns711i0ti.cloudfront.net/assets/seoul.jpg';

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
        bgImage={`url(${bgUrl})`}
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
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
  if (_article.type === POST)
    return (
      <Box paddingBottom="10">
        <PseudoBox
          as="a"
          {...{ href: `/article/${_article.id}` }}
          role="group"
          fontSize="lg"
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
        {_article.desc !== '' && <Text>{_article.desc}</Text>}
        <Text color="placeholder">
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
          fontSize="lg"
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
        {_article.desc !== '' && <Text>{_article.desc}</Text>}
        <Text color="placeholder">
          {date.formatPastDate(_article.updatedAt)}
        </Text>
      </Box>
    );
  return <Heading>unknown type</Heading>;
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
        <Box h={10} />
        <Stack spacing={10}>
          {articles.map((a) => (
            <ArticleItem key={a.id} _article={a} />
          ))}
        </Stack>
        <Text>Search more articles</Text>
        <Box h={10} />
        <Box>
          <Heading as="h1">Contact</Heading>
          <Text>email: sungryeolp@gmail.com</Text>
        </Box>
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
