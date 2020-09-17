/* eslint-disable react/no-danger */
import React from 'react';
import { GA_TRACKING_ID } from 'lib/gtag';

const code = `
window.dataLayer = window.dataLayer || [];
function gtag(){
dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', '${GA_TRACKING_ID}');
`;

const GAHeader: React.FC = () => (
  <>
    <script
      async
      src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
    />
    <script
      dangerouslySetInnerHTML={{
        __html: code,
      }}
    />
  </>
);

export default GAHeader;
