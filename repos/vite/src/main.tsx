import { StrictMode } from 'react'

import App from './App'
import { Store } from '@store'
import { Provider } from 'react-redux'
import { createRoot } from 'react-dom/client'


createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Provider store={Store}>
      <App />
    </Provider>
  </StrictMode>
)
