import { lazy, Suspense, StrictMode  } from 'react'
import { createRoot } from 'react-dom/client'

const App = lazy(() => import('./App'))
const GobletIframe = lazy(() => import('./screens/GobletIframe'))

const Waiting = () => {
  return (
    <div>
      Loading...
    </div>
  )
}

const AppPicker = () => {
  return window.location.pathname === `/goblet-iframe`
    ? (
        <Suspense fallback={<Waiting />}>
          <GobletIframe />
        </Suspense>
      )
    : (
        <Suspense fallback={<Waiting />}>
          <App />
        </Suspense>
      )
}

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <AppPicker />
  </StrictMode>
)
