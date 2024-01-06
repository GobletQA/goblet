import type { ReactNode } from 'react'

import { ErrorBoundary as RErrBound } from 'react-error-boundary'
import { ErrFallback } from './ErrFallback'

export type TErrorBoundary = {
  children:ReactNode
}

type TErrInfo = {
  componentStack:string
}


const logError = (error:Error, info:TErrInfo) => {
  // TODO: send error to backend logger / reporter system
}

const ErrorBoundary = (props:TErrorBoundary) => {
  const {
    children
  } = props

  return (
    <RErrBound
      onError={logError}
      FallbackComponent={ErrFallback}
    >
      {children}
    </RErrBound>
  )
  
}

export default ErrorBoundary