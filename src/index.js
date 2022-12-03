import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.scss';
import App from './App';
import { SnackbarProvider } from 'notistack';
import reportWebVitals from './reportWebVitals';
import { CircularProgress } from '@mui/material';
import { Store } from './store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Suspense fallback={<CircularProgress />}>
      <Store>
        <SnackbarProvider
          iconVariant={{ error: '⛔' }}
          maxSnack={3}
        >
          <App />
        </SnackbarProvider>
      </Store>
    </Suspense>
  </React.StrictMode>,
);

reportWebVitals();
