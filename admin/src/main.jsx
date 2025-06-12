import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import GlobalContextProvider from './contexts/GlobalContextProvider.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <GlobalContextProvider>
  <StrictMode>
    <App />
  </StrictMode>
  </GlobalContextProvider>
  </BrowserRouter>,
)
