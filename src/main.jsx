import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { FileSystemProvider } from './contexts/FileSystemContext.jsx';
import { OSProvider } from './contexts/OSContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <OSProvider>
      <FileSystemProvider>
        <App />
      </FileSystemProvider>
    </OSProvider>
  </React.StrictMode>
);
