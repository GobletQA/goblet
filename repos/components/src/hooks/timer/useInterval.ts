import { useEffect, useRef } from 'react'
import { isNum, emptyObj } from '@keg-hub/jsutils'
import { useInline } from '@GBC/hooks/components/useInline'

type TIntervalOpts = {
  immediate?: boolean
}

export const useInterval = (
  fn:() => void,
  delay:number | undefined,
  options:TIntervalOpts=emptyObj,
) => {

  const { immediate } = options
  const internalCB = useInline(fn)
  const timerRef = useRef<NodeJS.Timer | null>(null)
  const clear = useInline<() => void>(() => timerRef.current && clearInterval(timerRef.current))

  useEffect(() => {
    if (!isNum(delay) || delay < 0) return

    immediate && internalCB()
    timerRef.current = setInterval(() => internalCB(), delay)

    return () => { clear() }
  }, [delay])


  return clear
}
