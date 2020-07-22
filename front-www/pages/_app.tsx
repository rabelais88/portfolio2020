/* eslint-disable react/prop-types */
import React, { useEffect, Fragment } from 'react';
import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';
import { NextPageContext } from 'next';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import 'katex/dist/katex.min.css';

import wrapper from 'store/root';
import { VERSION, NODE_ENV } from 'env';
import Logger from 'lib/logger';
import ChakraProvider from 'components/ChakraProvider';

const logger = new Logger('pages/_app.js');

const MyApp = ({ Component, pageProps }): JSX.Element => {
  useEffect(() => {
    logger.log(`${NODE_ENV} v${VERSION}`);
  }, []);
  return (
    <ChakraProvider>
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
