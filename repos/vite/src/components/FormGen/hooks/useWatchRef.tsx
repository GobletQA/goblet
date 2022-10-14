import { useEffect, useRef } from 'react'
import { deepMerge }  from '@keg-hub/jsutils'

export const useWatchRef = <T=any>(toWatch:T, merge:boolean=false) => {

  const watchRef = useRef<T>(toWatch)
  useEffect(() => {
    if(watchRef.current === toWatch) return

    watchRef.current = merge ? deepMerge(watchRef.current, toWatch)  : toWatch
  }, [toWatch])

  return watchRef

}