import React from 'react';
import { Grid, Image, Box, Heading, Icon, Flex, Link } from '@chakra-ui/core';
import { Z_MENU, Z_SEARCH_BUTTON } from 'constants/zIndex';
import AnimatedLogo from 'components/AnimatedLogo';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { changeMenuOpen, setMenuOpen } from 'store/ui/action';
import { useDispatch } from 'react-redux';
import { useUiStore } from 'redux-getters';

import chakraTheme from './chakraTheme';

const Menu: React.FC = (props) => {
  const router = useRouter();
  const isIndex = router.pathname === '/';
  const dispatch = useDispatch();
  const { menuOpen } = useUiStore();
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
      backgroundColor={isIndex ? 'transparent' : 'rgba(255,255,255,.5)'}
      style={{ backdropFilter: 'blur(50px) saturate(180%)' }}
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
        <Link href="/" _hover={{ textDecor: 'none' }}>
          <motion.h2
            style={{
              color: isIndex ? 'white' : 'black',
              textShadow: chakraTheme.shadows.sm,
              fontFamily: chakraTheme.fonts.heading,
              fontSize: chakraTheme.fontSizes.sm,
            }}
            whileTap={{ textShadow: 'none', scale: 1 }}
            whileHover={{ scale: 1.2 }}
          >
            Sungryeol
          </motion.h2>
        </Link>
      </Flex>
      <Flex
        w="100%"
        alignItems="center"
        justifyContent="center"
        gridColumn={['span 2', 'span 1']}
        onClick={() => dispatch(changeMenuOpen(!menuOpen))}
        cursor="pointer"
      >
        <Icon
          name="search"
          color={isIndex ? 'white' : 'black'}
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
