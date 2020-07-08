/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, number } from '@storybook/addon-knobs';
import Paginator from '../components/Paginator';
import ChakraProvider from '../components/ChakraProvider';

export default { title: 'Paginator', decorators: [withKnobs] };

export const defaultTest = () => {
  const [page, setPage] = useState(1);
  return (
    <ChakraProvider>
      <Paginator
        count={number('count', 100)}
        size={number('size', 20)}
        page={page}
        onPageClick={setPage}
      />
    </ChakraProvider>
  );
};
