import React from 'react';
import ReactDOM from 'react-dom/client';
import '@mdi/font/css/materialdesignicons.min.css';
import '@/styles/global.css';
import { App } from '@/app/App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
