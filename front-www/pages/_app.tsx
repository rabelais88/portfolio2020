/* eslint-disable react/prop-types */
import React, { useEffect, Fragment } from 'react';
import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';
import { NextPageContext } from 'next';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import 'katex/dist/katex.min.css';
import 'styles/font.css';
import 'github-markdown-css';

import wrapper from 'store/root';
import { VERSION, NODE_ENV, GOOGLE_ANALYTICS_TRACKING_ID } from 'env';
import Logger from 'lib/logger';
import ChakraProvider from 'components/ChakraProvider';
import { GoogleAnalyticsHeader } from 'components';
import useGoogleAnalytics from 'components/useGoogleAnalytics';

const logger = new Logger('pages/_app.js');
const GAenabled = GOOGLE_ANALYTICS_TRACKING_ID !== '';

const MyApp = ({ Component, pageProps }): JSX.Element => {
  useEffect(() => {
    logger.log(`${NODE_ENV} v${VERSION}`);
  }, []);
  if (GAenabled) useGoogleAnalytics();
  return (
    <ChakraProvider>
      {GAenabled && <GoogleAnalyticsHeader />}
      <Component {...pageProps} />
      <ToastContainer />
    </ChakraProvider>
  );
};

// MyApp.getInitialProps = async (ctx: NextPageContext) => {
//   const _ctx: any = ctx;
//   _ctx.store = store;
//   return {};
// };

export default wrapper.withRedux(MyApp);
