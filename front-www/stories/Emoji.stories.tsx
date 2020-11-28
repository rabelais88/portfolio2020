/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { withKnobs, text } from '@storybook/addon-knobs';
import { Emoji } from '../components';

export default { title: 'Emoji', decorators: [withKnobs] };

export const writingHand = () => <Emoji type="✍️" label="writing-hand" />;
export const chain = () => <Emoji type="🔗" label="link" />;
