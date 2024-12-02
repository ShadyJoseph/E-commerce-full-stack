import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store, { persistor } from './stores/store';
import { PersistGate } from 'redux-persist/integration/react';
import { setStore } from './api/axiosConfig';
import { syncAuthState } from './stores/store'

// Set the store reference early
setStore(store);

async function initializeApp() {
  try {
    // Synchronize authentication state before rendering the app
    await syncAuthState();
  } catch (error) {
    console.error('Error syncing authentication state:', error);
  }

  // Render the application after initialization
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
}

// Initialize and render the app
initializeApp();
