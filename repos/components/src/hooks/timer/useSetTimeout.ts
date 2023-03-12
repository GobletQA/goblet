import { useEffect, useRef } from 'react'
import { checkCall } from '@keg-hub/jsutils'

type TTimeoutHookProps = {
  disable?: boolean
  callback: (...args:any[])=> any
  delay: number
  condition: any
}

export const useSetTimeout = (props:TTimeoutHookProps) => {
  const { disable, callback, delay, condition } = props
  const timeoutRef = useRef<NodeJS.Timeout|undefined>()

  useEffect(() => {
    if(disable || timeoutRef.current) return
    
    timeoutRef.current = condition
      ? setTimeout(() => checkCall(callback, condition), delay)
      : undefined

    return () => {
      timeoutRef.current && clearTimeout(timeoutRef.current)
      timeoutRef.current = undefined
    }
  }, [disable, delay, condition])
}
