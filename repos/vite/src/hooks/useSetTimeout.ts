import { useEffect, useRef } from 'react'
import { checkCall } from '@keg-hub/jsutils'

type TTimeoutHookProps = {
  callback: (...args:any[])=> any
  delay: number
  condition: any
}

export const useSetTimeout = (props:TTimeoutHookProps) => {
  const { callback, delay, condition } = props
  const timeoutRef = useRef<NodeJS.Timeout|undefined>()

  useEffect(() => {
    if(timeoutRef.current) return
    
    timeoutRef.current = condition
      ? setTimeout(() => checkCall(callback, condition), delay)
      : undefined

    return () => {
      timeoutRef.current && clearTimeout(timeoutRef.current)
      timeoutRef.current = undefined
    }
  }, [delay, condition])
}
