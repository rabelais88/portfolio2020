/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { action } from '@storybook/addon-actions';
import { Button } from '@storybook/react/demo';
import { withKnobs, text } from '@storybook/addon-knobs';

export default { title: 'Button', decorators: [withKnobs] };

export const withText = () => (
  <Button onClick={action('clicked')}>
    {text('text label', 'hello world')}
  </Button>
);

export const withSomeEmoji = () => (
  <Button onClick={action('clicked')}>
    <span role="img" aria-label="so cool">
      {text('emoji label', '😀 😎 👍 💯')}
    </span>
  </Button>
);
