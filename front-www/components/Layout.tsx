import React from 'react';
import { Box } from '@chakra-ui/core';
import { useUiStore } from 'redux-getters';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { Z_BLOCKER } from 'constants/zIndex';

import Menu from './Menu';
import Search from './Search';
import DisplayDetect from './DisplayDetect';

const MotionBox = motion.custom(Box);

const Blocker = () => {
  const uiStore = useUiStore();

  const blockerVariants: Variants = {
    enter: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <AnimatePresence>
      {uiStore.menuOpen && (
        <MotionBox
          top="0"
          left="0"
          right="0"
          bottom="0"
          position="fixed"
          backgroundColor="rgba(0,0,0,0.5)"
          zIndex={Z_BLOCKER}
          variants={blockerVariants}
          initial="exit"
          animate="enter"
          exit="exit"
        />
      )}
    </AnimatePresence>
  );
};

export const Layout: React.FunctionComponent<unknown> = (props) => {
  const { children } = props;

  return (
    <Box width="100%" minH="100%">
      <DisplayDetect />
      <Search />
      <Menu />
      <Blocker />
      <Box
        p={[3, 12]}
        marginY={['60px', '30px']}
        justifyContent="center"
        display="flex"
      >
        <Box maxW="700px" w="full">
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
