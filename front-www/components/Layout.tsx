import React from 'react';
import { Box } from '@chakra-ui/core';
import Menu from './Menu';
import DisplayDetect from './DisplayDetect';

export const Layout: React.FunctionComponent<unknown> = (props) => {
  const { children } = props;
  return (
    <Box width="100%" minH="100%">
      <DisplayDetect />
      <Menu />
      <Box p={[3, 6]}>{children}</Box>
    </Box>
  );
};

export default Layout;
