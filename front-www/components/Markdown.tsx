/* eslint-disable react/display-name */
import React from 'react';
import ReactMarkdown from 'react-markdown';
import RemarkMathPlugin from 'remark-math';
import { BlockMath, InlineMath } from 'react-katex';
import CodeBlock from './CodeBlock';

const _mapProps = (props) => ({
  ...props,
  escapeHtml: false,
  plugins: [RemarkMathPlugin],
  renderers: {
    ...props.renderers,
    math: ({ value }) => <BlockMath>{value}</BlockMath>,
    inlineMath: ({ value }) => <InlineMath>{value}</InlineMath>,
    code: ({ value, language }) => (
      <CodeBlock language={language} value={value} />
    ),
  },
});

const Markdown = (props) => <ReactMarkdown {..._mapProps(props)} />;

export default Markdown;
