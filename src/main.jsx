import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { SatelliteProvider } from './context/SatelliteContext'
import ErrorBoundary from './components/ErrorBoundary'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <SatelliteProvider>
          <App />
        </SatelliteProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)
