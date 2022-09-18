import { useEffect } from 'react'
import { checkCall } from '@keg-hub/jsutils'

type TTimeoutHookProps = {
  callback: (...args:any[])=> any
  delay: number
  condition: any
}

export const useSetTimeout = (props:TTimeoutHookProps) => {
  const { callback, delay, condition } = props

  useEffect(() => {
    const timeout =
      condition && setTimeout(() => checkCall(callback, condition), delay)

    return () => timeout && clearTimeout(timeout)
  }, [delay, condition])
}
