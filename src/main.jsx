import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// /designsystem (as on V1) and /kit: the V2 design system page, split out of the main bundle.
const KitPage = React.lazy(() => import('./components/v2/KitPage.jsx'));
const isKit = typeof window !== 'undefined' && ['/kit', '/designsystem'].includes(window.location.pathname.replace(/\/+$/, ''));

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
