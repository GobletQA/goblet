import { StrictMode } from 'react'

import App from './App'
import { Store } from '@store'
import { Provider } from 'react-redux'
import { createRoot } from 'react-dom/client'
import ErrorBoundary from '@components/ErrorBoundary/ErrorBoundary'


createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={Store}>
        <App />
      </Provider>
    </ErrorBoundary>
  </StrictMode>
)
