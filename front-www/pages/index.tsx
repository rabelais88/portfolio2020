import React from 'react';
import { connect, useDispatch } from 'react-redux';
import Head from 'next/head';

import wrapper from 'store/root';
import getArticleReducer from 'redux-getters/getArticleReducer';
import { getArticles, getRecentArticles } from 'store/article/action';
import { Logger } from 'lib';
import { ArticleItem, Cover, DefaultIconHeader } from 'components';
import Layout from 'components/Layout';
import { Text, Box, Heading, Stack, Link, PseudoBox } from '@chakra-ui/core';
import { useRouter } from 'next/router';
import linkStyle from 'styles/links.module.css';
import theme from 'components/chakraTheme';
import { changeMenuOpen, setMenuOpen } from 'store/ui/action';

const logger = new Logger('pages/index.tsx');

interface _HomePage {
  (): JSX.Element;
}

const LinkObservable = () => (
  <Stack
    as="a"
    {...{ href: 'https://observablehq.com/@rabelais' }}
    className={linkStyle.links}
    alignItems="center"
    justifyContent="space-between"
  >
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline' }}
    >
      <path
        d="M16.5368 0C16.2444 0 16.0068 0.2376 16.0068 0.5304C16.0068 0.5576 16.0184 0.5812 16.0224 0.6076H16.0068V13.1828C16.0068 13.4756 16.2444 13.7132 16.5368 13.7132H29.1116V13.6976C29.138 13.7016 29.1616 13.7132 29.1892 13.7132C29.4816 13.7132 29.7192 13.4756 29.7192 13.1828C29.644 5.9348 23.7848 0.0756 16.5368 0Z"
        fill="#3B4658"
      />
      <path
        d="M26.6536 16.236C26.6536 15.9432 26.4164 15.7056 26.1236 15.7056H14.564C14.4234 15.7055 14.2886 15.6496 14.1892 15.5501C14.0898 15.4507 14.034 15.3158 14.034 15.1752V3.65801H14.0184C14.0224 3.63161 14.034 3.60802 14.034 3.58082C14.034 3.28762 13.7964 3.05042 13.5036 3.05042C13.4908 3.05042 13.4804 3.05681 13.468 3.05761V3.05401C13.4208 3.05361 13.374 3.05042 13.3268 3.05042C5.9668 3.05042 0 9.01722 0 16.3772C0 23.7372 5.9668 29.704 13.3268 29.704C20.6868 29.704 26.6536 23.7372 26.6536 16.3772C26.6536 16.3348 26.6516 16.2928 26.6508 16.25C26.6508 16.2448 26.6536 16.2408 26.6536 16.236Z"
        fill="#3B4658"
      />
    </svg>
    <Text as="span" fontSize="xs">
      ObservableHQ
    </Text>
  </Stack>
);

const LinkGithub = () => (
  <Stack
    as="a"
    {...{ href: 'https://github.com/rabelais88' }}
    className={linkStyle.links}
    alignItems="center"
    justifyContent="space-between"
  >
    <svg
      width="35"
      height="35"
      viewBox="0 0 35 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.4844 1.46274e-06C7.82422 -0.00390479 0 7.81641 0 17.4688C0 25.1016 4.89453 31.5898 11.7109 33.9727C12.6289 34.2031 12.4883 33.5508 12.4883 33.1055V30.0781C7.1875 30.6992 6.97266 27.1914 6.61719 26.6055C5.89844 25.3789 4.19922 25.0664 4.70703 24.4805C5.91406 23.8594 7.14453 24.6367 8.57031 26.7422C9.60156 28.2695 11.6133 28.0117 12.6328 27.7578C12.8555 26.8398 13.332 26.0195 13.9883 25.3828C8.49609 24.3984 6.20703 21.0469 6.20703 17.0625C6.20703 15.1289 6.84375 13.3516 8.09375 11.918C7.29688 9.55469 8.16797 7.53125 8.28516 7.23047C10.5547 7.02735 12.9141 8.85547 13.0977 9C14.3867 8.65235 15.8594 8.46875 17.5078 8.46875C19.1641 8.46875 20.6406 8.66016 21.9414 9.01172C22.3828 8.67578 24.5703 7.10547 26.6797 7.29688C26.793 7.59766 27.6445 9.57422 26.8945 11.9063C28.1602 13.3438 28.8047 15.1367 28.8047 17.0742C28.8047 21.0664 26.5 24.4219 20.9922 25.3906C21.4639 25.8546 21.8385 26.4079 22.0941 27.0182C22.3496 27.6285 22.481 28.2837 22.4805 28.9453V33.3398C22.5117 33.6914 22.4805 34.0391 23.0664 34.0391C29.9844 31.707 34.9648 25.1719 34.9648 17.4727C34.9648 7.81641 27.1367 1.46274e-06 17.4844 1.46274e-06Z"
        fill="#3B4658"
      />
    </svg>
    <Text as="span" fontSize="xs">
      Github
    </Text>
  </Stack>
);

const LinkInstagram = () => (
  <Stack
    as="a"
    {...{ href: 'https://instagram.com/rabelais' }}
    className={linkStyle.links}
    alignItems="center"
    justifyContent="space-between"
  >
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.6105 10.4074C12.7434 10.4074 10.4035 12.7473 10.4035 15.6144C10.4035 18.4816 12.7434 20.8215 15.6105 20.8215C18.4777 20.8215 20.8176 18.4816 20.8176 15.6144C20.8176 12.7473 18.4777 10.4074 15.6105 10.4074ZM31.2277 15.6144C31.2277 13.4582 31.2473 11.3215 31.1262 9.16913C31.0051 6.66913 30.4348 4.45038 28.6066 2.62226C26.7746 0.790224 24.5598 0.223818 22.0598 0.102724C19.9035 -0.0183694 17.7668 0.00116189 15.6144 0.00116189C13.4582 0.00116189 11.3215 -0.0183694 9.16913 0.102724C6.66913 0.223818 4.45038 0.79413 2.62226 2.62226C0.790224 4.45429 0.223818 6.66913 0.102724 9.16913C-0.0183694 11.3254 0.00116189 13.4621 0.00116189 15.6144C0.00116189 17.7668 -0.0183694 19.9074 0.102724 22.0598C0.223818 24.5598 0.794131 26.7785 2.62226 28.6066C4.45429 30.4387 6.66913 31.0051 9.16913 31.1262C11.3254 31.2473 13.4621 31.2277 15.6144 31.2277C17.7707 31.2277 19.9074 31.2473 22.0598 31.1262C24.5598 31.0051 26.7785 30.4348 28.6066 28.6066C30.4387 26.7746 31.0051 24.5598 31.1262 22.0598C31.2512 19.9074 31.2277 17.7707 31.2277 15.6144ZM15.6105 23.6262C11.1769 23.6262 7.59882 20.048 7.59882 15.6144C7.59882 11.1808 11.1769 7.60272 15.6105 7.60272C20.0441 7.60272 23.6223 11.1808 23.6223 15.6144C23.6223 20.048 20.0441 23.6262 15.6105 23.6262ZM23.9504 9.14569C22.9152 9.14569 22.0793 8.30976 22.0793 7.2746C22.0793 6.23944 22.9152 5.40351 23.9504 5.40351C24.9855 5.40351 25.8215 6.23944 25.8215 7.2746C25.8218 7.5204 25.7736 7.76385 25.6797 7.991C25.5858 8.21815 25.4479 8.42454 25.2741 8.59835C25.1003 8.77216 24.8939 8.90997 24.6668 9.00389C24.4396 9.09782 24.1962 9.146 23.9504 9.14569Z"
        fill="#3B4658"
      />
    </svg>

    <Text as="span" fontSize="xs">
      Instagram
    </Text>
  </Stack>
);

const LinkCodepen = () => (
  <Stack
    as="a"
    {...{ href: 'https://codepen.com/rabelais88' }}
    className={linkStyle.links}
    alignItems="center"
    justifyContent="space-between"
  >
    <svg
      width="35"
      height="35"
      viewBox="0 0 35 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.5664 13.6992V9.35156L9.25391 14.2188L12.5195 16.3984L16.5664 13.6992ZM26.4922 19.0781V15.9609L24.1563 17.5195L26.4922 19.0781ZM17.5 0C7.83594 0 0 7.83594 0 17.5C0 27.1641 7.83594 35 17.5 35C27.1641 35 35 27.1641 35 17.5C35 7.83594 27.1641 0 17.5 0ZM28.3594 20.8203C28.3594 20.8633 28.3555 20.9023 28.3516 20.9414C28.3516 20.957 28.3477 20.9687 28.3437 20.9805C28.3382 21.0232 28.3278 21.0652 28.3125 21.1055C28.3047 21.1289 28.2969 21.1523 28.2891 21.1719C28.2813 21.1875 28.2734 21.2031 28.2695 21.2188C28.2578 21.2383 28.25 21.2617 28.2383 21.2812C28.2305 21.2969 28.2227 21.3086 28.2109 21.3242C28.1992 21.3438 28.1836 21.3633 28.1719 21.3828C28.1602 21.3984 28.1523 21.4102 28.1406 21.4219C28.125 21.4375 28.1094 21.457 28.0938 21.4727C28.082 21.4844 28.0703 21.4961 28.0547 21.5078C28.0391 21.5234 28.0195 21.5391 28 21.5508C27.9844 21.5625 27.9727 21.5742 27.957 21.582C27.9531 21.5859 27.9453 21.5898 27.9414 21.5937L18.0156 28.2031C17.8594 28.3086 17.6797 28.3594 17.5 28.3594C17.3164 28.3594 17.1367 28.3047 16.9805 28.2031L7.05469 21.5977C7.05078 21.5938 7.04297 21.5898 7.03906 21.5859L6.99609 21.5547C6.97656 21.5391 6.96094 21.5273 6.94531 21.5117C6.93359 21.5 6.92188 21.4883 6.90625 21.4766C6.89063 21.4609 6.875 21.4453 6.85938 21.4258C6.84779 21.4137 6.83733 21.4007 6.82813 21.3867C6.8125 21.3672 6.80078 21.3477 6.78906 21.3281C6.78125 21.3125 6.76953 21.3008 6.76172 21.2852C6.75 21.2656 6.73828 21.2422 6.73047 21.2227C6.72266 21.207 6.71484 21.1914 6.71094 21.1758C6.70313 21.1523 6.69531 21.1289 6.6875 21.1094C6.68359 21.0938 6.67578 21.0781 6.67188 21.0625C6.66406 21.0352 6.66016 21.0117 6.65625 20.9844C6.65234 20.9727 6.65234 20.957 6.64844 20.9453C6.64453 20.9063 6.64062 20.8633 6.64062 20.8242V14.2148C6.64062 14.1758 6.64453 14.1328 6.64844 14.0937C6.65234 14.082 6.65234 14.0664 6.65625 14.0547C6.66176 14.0119 6.67225 13.97 6.6875 13.9297C6.69531 13.9063 6.70313 13.8828 6.71094 13.8633C6.71875 13.8477 6.72656 13.832 6.73047 13.8164C6.73828 13.7969 6.75 13.7734 6.76172 13.7539C6.76953 13.7383 6.77734 13.7266 6.78906 13.7109C6.8125 13.6758 6.83594 13.6445 6.85938 13.6133C6.875 13.5977 6.89063 13.5781 6.90625 13.5625C6.91797 13.5508 6.92969 13.5391 6.94531 13.5273C6.96094 13.5117 6.98047 13.4961 6.99609 13.4844C7.01172 13.4727 7.02344 13.4609 7.03906 13.4531C7.04297 13.4492 7.05078 13.4453 7.05469 13.4414L16.9805 6.83594C17.293 6.62891 17.7031 6.62891 18.0156 6.83594L27.9414 13.4414C27.9453 13.4453 27.9531 13.4492 27.957 13.4531L28 13.4844L28.0547 13.5273C28.0664 13.5391 28.0781 13.5508 28.0938 13.5625C28.1094 13.5781 28.125 13.5938 28.1406 13.6133C28.168 13.6445 28.1914 13.6758 28.2109 13.7109C28.2188 13.7266 28.2305 13.7383 28.2383 13.7539C28.25 13.7734 28.2617 13.793 28.2695 13.8164C28.2773 13.832 28.2852 13.8477 28.2891 13.8633C28.2969 13.8867 28.3047 13.9102 28.3125 13.9297C28.3164 13.9453 28.3242 13.9609 28.3281 13.9766C28.3359 14.0039 28.3398 14.0273 28.3437 14.0547C28.3477 14.0664 28.3477 14.082 28.3516 14.0937C28.3555 14.1328 28.3594 14.1758 28.3594 14.2148V20.8203V20.8203ZM18.4336 21.3398V25.6875L25.7461 20.8203L22.4805 18.6406L18.4336 21.3398ZM8.50781 15.9609V19.0781L10.8438 17.5195L8.50781 15.9609ZM17.5 15.3164L14.1992 17.5195L17.5 19.7227L20.8008 17.5195L17.5 15.3164ZM25.7461 14.2188L18.4336 9.35156V13.6992L22.4805 16.3984L25.7461 14.2188ZM12.5195 18.6406L9.25391 20.8203L16.5664 25.6875V21.3398L12.5195 18.6406V18.6406Z"
        fill="#3B4658"
      />
    </svg>

    <Text as="span" fontSize="xs">
      Codepen
    </Text>
  </Stack>
);

const HomePage: _HomePage = () => {
  const articleStore = getArticleReducer();
  const { recentArticles, count, size, page, tag, loadState } = articleStore;
  const dispatch = useDispatch();
  const router = useRouter();

  const onSearchClick = async () => {
    await dispatch(changeMenuOpen(true));
  };

  return (
    <Layout>
      <Head>
        <DefaultIconHeader />
        <title>sungryeol.com</title>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          property="og:title"
          content="sungryeol.com"
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
        <meta property="og:type" content="index" />
        <meta property="og:url" content="http://sungryeol.com" />
        <meta property="og:site_name" content="sungryeol's portfolio" />
      </Head>
      <Cover />
      <Box position="relative" top="100vh">
        <Heading as="h1">Recent Post</Heading>
        <Box h={10} />
        <Stack spacing={10}>
          {recentArticles.map((a) => (
            <ArticleItem key={a.id} _article={a} />
          ))}
        </Stack>
        <PseudoBox
          as="p"
          cursor="pointer"
          onClick={onSearchClick}
          _hover={{ transition: '.3s', color: theme.colors.point_teal }}
          transition=".3s"
        >
          Search more articles
        </PseudoBox>
        <Box h={10} />
        <Stack alignItems="center">
          <Heading as="h1">Contact</Heading>
          <Box h="10" />
          <Stack
            flexDir="row"
            flexWrap="wrap"
            justifyContent="space-between"
            maxW="400px"
            width={['300px', 'full']}
          >
            <LinkObservable />
            <LinkGithub />
            <LinkInstagram />
            <LinkCodepen />
          </Stack>
          <Box h="10" />
          <Link href="mailto:sungryeolp@gmail.com">sungryeolp@gmail.com</Link>
          <Box h="10" />
        </Stack>
      </Box>
    </Layout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (props) => {
  const { store } = props;
  await store.dispatch(getRecentArticles());
  logger.log(store.getState());
});

// export default connect(null, null)(HomePage);
export default HomePage;
