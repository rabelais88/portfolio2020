/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text } from '@storybook/addon-knobs';
import TagViz from '../components/TagViz';
import sampleTags from './sampleTags.json';

export default { title: 'TagViz', decorators: [withKnobs] };

export const defaultData = () => <TagViz tags={sampleTags} />;
