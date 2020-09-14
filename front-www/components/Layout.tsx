import React from 'react';
import { Box } from '@chakra-ui/core';
import Menu from './Menu';
import Search from './Search';
import DisplayDetect from './DisplayDetect';

export const Layout: React.FunctionComponent<unknown> = (props) => {
  const { children } = props;
  return (
    <Box width="100%" minH="100%">
      <DisplayDetect />
      <Search />
      <Menu />
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
