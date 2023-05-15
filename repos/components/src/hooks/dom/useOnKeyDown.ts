import type { KeyboardEvent, KeyboardEventHandler } from 'react'

import { ensureArr, emptyArr } from '@keg-hub/jsutils'
import { useCallback, useMemo, useEffect } from 'react'
import { useInline } from '@GBC/hooks/components/useInline'

type THKeyDown<T> = {
  key?:string|string[]
  keyboard?:string|string[]
  onKeyDown?:(<T>(event:KeyboardEvent<T>) => void) | KeyboardEventHandler<T>
}

export const useOnKeyDown = <T=any>(props:THKeyDown<T>) => {
  const {
    key,
    keyboard,
  } = props

  const onKeyDownCb = useInline(props.onKeyDown)

  const keys = useMemo(() => {
    if(key?.length && keyboard?.length) return emptyArr

    return ensureArr<string>(key || keyboard)
      .filter(Boolean)
      .map((item) => item.toLowerCase())

  }, [key, keyboard])

  const onKeyDown = useCallback((evt:KeyboardEvent<T>) => {
    if(!keys?.length || keys === emptyArr) return

    keys.includes((evt as Record<`key`, string> ).key?.toLowerCase())
      && onKeyDownCb?.<T>(evt)
  }, [
    keys,
    onKeyDownCb
  ])
  
  useEffect(() => {
    document.addEventListener(`keydown`, onKeyDown as any)
    return () => {
      document.removeEventListener(`keydown`, onKeyDown as any)
    }
  }, [
    onKeyDown
  ])

}
