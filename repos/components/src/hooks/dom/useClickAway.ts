import { useCallback } from 'react'
import { useInline } from '@GBC/hooks/components/useInline'
import { SkipClickAwayCls } from '@GBC/constants'

const checkSkipClickAway = (element:EventTarget|null):boolean => {
  const el = element as HTMLElement
  const hasSkip = el?.classList?.contains(SkipClickAwayCls)

  return hasSkip
    || Boolean(el?.parentElement && checkSkipClickAway(el?.parentElement))
}


export const useClickAway = (cb?:(state:boolean) => void) => {
  const callback = useInline(cb)

  return useCallback((event: MouseEvent | TouchEvent) => {
    const isAway = Boolean(event.target && checkSkipClickAway(event.target))
    callback?.(isAway)

    return isAway
  }, [])
}