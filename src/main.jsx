/**
 * Main entry point for the React Slides application.
 * This file initializes the React application and mounts it to the DOM.
 * StrictMode is enabled for additional development checks and warnings.
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Create and render the root React component
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
) 