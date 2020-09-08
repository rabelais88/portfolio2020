/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, number } from '@storybook/addon-knobs';
import ChakraProvider from '../components/ChakraProvider';
import FollowingLogo from '../components/FollowingLogo';

export default { title: 'Paginator', decorators: [withKnobs] };

export const defaultTest = () => {
  return (
    <ChakraProvider>
      <FollowingLogo />
    </ChakraProvider>
  );
};
