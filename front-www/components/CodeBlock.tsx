import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

type codeBlockProps = {
  value: string;
  language?: string;
};

const CodeBlock: React.FC<codeBlockProps> = (props: codeBlockProps) => {
  const { language, value } = props;
  return (
    <SyntaxHighlighter language={language} style={docco}>
      {value}
    </SyntaxHighlighter>
  );
};

CodeBlock.defaultProps = {
  language: null,
};

export default CodeBlock;
