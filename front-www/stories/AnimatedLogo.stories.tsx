/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text } from '@storybook/addon-knobs';
import AnimatedLogo from 'components/AnimatedLogo';

export default { title: 'Animated Logo', decorators: [withKnobs] };

export const defaultTest = () => <AnimatedLogo />;

