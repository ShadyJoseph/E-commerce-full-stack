import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store, { persistor }  from './stores/store';
import { PersistGate } from 'redux-persist/integration/react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
     <PersistGate loading={null} persistor={persistor}>
  <Provider store={store}>
    <App />
  </Provider>
  </PersistGate>
  </React.StrictMode>
);
reportWebVitals();
