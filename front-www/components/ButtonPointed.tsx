import React from 'react';
import { Button } from '@chakra-ui/core';

const ButtonPointed: React.FC = ({ children }) => {
  return (
    <Button
      boxShadow="10px 10px 25px #52D1DF"
      backgroundColor="#52D1DF"
      borderRadius="6px"
      color="white"
    >
      {children}
    </Button>
  );
};

export default ButtonPointed;
