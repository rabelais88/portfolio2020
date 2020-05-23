/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { store, persistor } from '../store';
import { VERSION, NODE_ENV } from '../env';
import Logger from '../lib/logger';

const logger = new Logger('pages/_app.js');

const MyApp = ({ Component, pageProps }): JSX.Element => {
  useEffect(() => {
    logger.log(`${NODE_ENV} v${VERSION}`);
  }, []);
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <Component {...pageProps} />
        <ToastContainer />
      </PersistGate>
    </Provider>
  );
};

export default MyApp;
