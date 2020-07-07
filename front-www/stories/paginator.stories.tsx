/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, number } from '@storybook/addon-knobs';
import Paginator from '../components/Paginator';

export default { title: 'Paginator', decorators: [withKnobs] };

export const defaultTest = () => {
  const [page, setPage] = useState(1);
  return (
    <div>
      <Paginator
        count={number('count', 100)}
        size={number('size', 20)}
        page={page}
        onPageClick={setPage}
      />
    </div>
  );
};
