import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// This is the root element from our public/index.html file
const root = ReactDOM.createRoot(document.getElementById('quiznova-admin-app'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);