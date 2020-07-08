import React from 'react';
import { ThemeProvider, CSSReset, ColorModeProvider } from '@chakra-ui/core';

import chakraTheme from './chakraTheme';

const ChakraProvider: React.FunctionComponent = (props) => {
  const { children } = props;
  return (
    <ThemeProvider theme={chakraTheme}>
      <ColorModeProvider>
        <CSSReset />
        {children}
      </ColorModeProvider>
    </ThemeProvider>
  );
};

export default ChakraProvider;
