import React, { useState, useEffect } from 'react';
import { Box, PseudoBox, Text, Flex, Heading, Image } from '@chakra-ui/core';
import theme from 'components/chakraTheme';
import { checkClient, Logger } from 'lib';
// import FollowingLogo from './FollowingLogo';

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

const Welcome = () => {
  const isClient = checkClient();

  return (
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
      <Box height="100vh" color="white">
        <Box h={['10%', '10%']} />
        <Flex h={['30%', '20%']} justifyContent="center" w="100%">
          <TitleHeading />
        </Flex>
        {/* <FollowingLogo /> */}
        <Flex h="auto" justifyContent="center">
          <Text>I make beautiful web stuff.</Text>
        </Flex>
      </Box>
      <Box position="relative">hello~~~</Box>
    </>
  );
};

export default Welcome;
