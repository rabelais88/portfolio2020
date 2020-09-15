import React from 'react';
import { Grid, Image, Box, Heading, Icon, Flex, Link } from '@chakra-ui/core';
import { Z_MENU, Z_SEARCH_BUTTON } from 'constants/zIndex';
import AnimatedLogo from 'components/AnimatedLogo';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { changeMenuOpen, setMenuOpen } from 'store/ui/action';
import { useDispatch } from 'react-redux';
import { useUiStore } from 'redux-getters';

const MotionFlex = motion.custom(Flex);
const MotionHeading = motion.custom(Heading);

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
          <MotionHeading
            color={isIndex ? 'white' : 'black'}
            textShadow="sm"
            fontSize="sm"
            whileTap={{ textShadow: 'none', scale: 1 }}
            whileHover={{ scale: 1.4 }}
          >
            Sungryeol
          </MotionHeading>
        </Link>
      </Flex>
      <MotionFlex
        w="100%"
        alignItems="center"
        justifyContent="center"
        gridColumn={['span 2', 'span 1']}
        onClick={() => dispatch(changeMenuOpen(!menuOpen))}
        cursor="pointer"
        zIndex={100}
        whileHover={{ scale: 1.4 }}
      >
        <Icon
          name="search"
          color={isIndex ? 'white' : 'black'}
          style={{
            WebkitFilter: 'drop-shadow(5px 5px 5px #222)',
            filter: 'drop-shadow(5px 5px 5px #222)',
          }}
        />
      </MotionFlex>
    </Grid>
  );
};

export default Menu;
