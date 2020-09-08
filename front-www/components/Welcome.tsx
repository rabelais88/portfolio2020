import React, { useState, useEffect } from 'react';
import { Box, PseudoBox, Text, Flex, Heading, Image } from '@chakra-ui/core';
import theme from 'components/chakraTheme';
import { checkClient, Logger } from 'lib';
import { motion, useSpring } from 'framer-motion';

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
  const [mouse, setMouse] = useState([0, 0, false]);
  const [mx, my, isActive] = mouse;
  const logoX = useSpring(0);
  const logoY = useSpring(0);
  useEffect(() => {
    logoX.set(mx);
    logoY.set(my);
  }, [mx, my]);
  const logoStyle = {
    x: logoX,
    y: logoY,
  };
  if (isActive) logoStyle.position = 'fixed';

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
        <Flex
          style={{ justifyContent: 'center', height: '20%' }}
          onMouseMove={(e) => {
            const { offsetTop, offsetLeft } = e.currentTarget;
            setMouse([e.pageX - offsetLeft, e.pageY - offsetTop, true]);
          }}
          onMouseEnter={() => setMouse([mx, my, true])}
          onMouseLeave={() => setMouse([0, 0, false])}
        >
          <motion.img
            src="/memoji2.png"
            height="200px"
            width="200px"
            style={logoStyle}
          />
        </Flex>
        <Flex h="auto" justifyContent="center">
          <Text>I make beautiful web stuff.</Text>
        </Flex>
      </Box>
      <Box position="relative">hello~~~</Box>
    </>
  );
};

export default Welcome;
