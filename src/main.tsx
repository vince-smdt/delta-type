import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { TypingTestProvider } from './contexts/TypingTestContext';
import 'bootstrap/dist/css/bootstrap.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <TypingTestProvider>
      <App />
    </TypingTestProvider>
  </React.StrictMode>,
)
