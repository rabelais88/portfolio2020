import React from 'react';
import { Grid, Image, Box, Heading, Icon, Flex } from '@chakra-ui/core';
import { Z_MENU } from 'constants/zIndex';
import AnimatedLogo from 'components/AnimatedLogo'

const Menu: React.FC = (props) => {
  return (
    <Grid
      h="63px"
      p={3}
      templateColumns="repeat(10, 1fr)"
      gap={6}
      w="100%"
      zIndex={Z_MENU}
      top="0"
      left="0"
      right="0"
      position="fixed"
    >
      <Flex
        w="100%"
        alignItems="center"
        justifyContent="center"
        gridColumn={['span 2', 'span 1']}
      >
        <AnimatedLogo width="45px" height="45px" />
        {/* <Image
          src="/memoji1.png"
          alt="memoji icon"
          w="45px"
          h="45px"
          style={{
            WebkitFilter: 'drop-shadow(5px 5px 5px #222)',
            filter: 'drop-shadow(5px 5px 5px #222)',
          }}
        /> */}
      </Flex>
      <Flex
        w="100%"
        gridColumn={['span 6', 'span 8']}
        alignItems="center"
        justifyContent="center"
      >
        <Heading fontSize="sm" color="white" textShadow="sm">
          Sungryeol
        </Heading>
      </Flex>
      <Flex
        w="100%"
        alignItems="center"
        justifyContent="center"
        gridColumn={['span 2', 'span 1']}
      >
        <Icon
          name="search"
          color="white"
          style={{
            WebkitFilter: 'drop-shadow(5px 5px 5px #222)',
            filter: 'drop-shadow(5px 5px 5px #222)',
          }}
        />
      </Flex>
    </Grid>
  );
};

export default Menu;
