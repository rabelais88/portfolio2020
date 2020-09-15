import React from 'react';
import { Flex, Spinner } from '@chakra-ui/core';

interface SpinnerProps {
  fullMode: boolean;
}
const FullSpinner: React.FC<SpinnerProps> = (props) => {
  const fullMode = props.fullMode || true;
  if (!fullMode)
    return (
      <Spinner speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
    );
  return (
    <Flex justifyContent="center" alignItems="center" w="full" h="full">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </Flex>
  );
};

export default FullSpinner;
