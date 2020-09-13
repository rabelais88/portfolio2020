import React from 'react';
import { Box, PseudoBox, Text, Flex, Heading, Image } from '@chakra-ui/core';
import theme from 'components/chakraTheme';
import { BrowserView, MobileView } from 'react-device-detect';
import welcomeStyle from 'styles/welcome.module.css';
import FollowingLogo from './FollowingLogo';

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
      h="100vh"
      top="0"
      left="0"
      right="0"
      zIndex={-1}
      position="absolute"
    >
      <PseudoBox
        // style={{ backdropFilter: 'blur(50px) saturate(180%)' }}
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

export default Cover;
