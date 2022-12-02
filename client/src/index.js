import React from 'react';
import ReactDOM from 'react-dom/client';
import * as serviceWorker from './serviceWorker';
import App from './App';
import {Provider} from 'react-redux';
import {store, persistor} from './redux/store';
import {QueryClient, QueryClientProvider} from 'react-query'
import {ModalProvider} from './context/modal-context/modal-context';
import ReactGA from 'react-ga'
import { PersistGate } from 'redux-persist/integration/react';

const TRACKING_ID = 'G-VZHMF6NTPJ'

ReactGA.initialize(TRACKING_ID, {
  debug: true,
  titleCase: false,
  gaOptions: {
    siteSpeedSampleRate: 100,
  },
})

const root = ReactDOM.createRoot(document.getElementById("root"));
const client = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            // staleTime: Infinity,
        }
    }
})

root.render (
    <QueryClientProvider client={client}>
        <Provider store={store}>
             <PersistGate loading={null} persistor={persistor}>
             <ModalProvider>
                <App/>
            </ModalProvider>
             </PersistGate>
        
        </Provider>
    </QueryClientProvider>
);

serviceWorker.unregister();
