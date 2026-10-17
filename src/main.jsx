import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// /kit: the V2 primitive review page, split out of the main bundle.
const KitPage = React.lazy(() => import('./components/v2/KitPage.jsx'));
const isKit = typeof window !== 'undefined' && window.location.pathname.replace(/\/+$/, '') === '/kit';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isKit ? (
      <React.Suspense fallback={null}>
        <KitPage />
      </React.Suspense>
    ) : (
      <App />
    )}
  </React.StrictMode>
);
