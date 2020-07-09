import React from 'react';
import { Box } from '@chakra-ui/core';
import Menu from './Menu';

export const Layout: React.FunctionComponent<unknown> = (props) => {
  const { children } = props;
  return (
    <Box width="100%" minH="100%">
      <Menu />
      <Box p={6}>{children}</Box>
    </Box>
  );
};

export default Layout;
