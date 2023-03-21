import type { TOnFeatureCB } from '@GBR/types'

import type { MutableRefObject } from 'react'

import { useEditor } from '@GBR/contexts'
import { useCallback, useEffect } from 'react'

export type THContainerHooks = {
  onFeatureSave: TOnFeatureCB
  containerRef:MutableRefObject<HTMLElement|undefined>
}

export const useContainerHooks = (props:THContainerHooks) => {
  
  const {
    containerRef,
    onFeatureSave,
  } = props

  const { feature } = useEditor()

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      const ctrlKey = event.ctrlKey || event.metaKey
      const key = event.key.toLowerCase()

      if (ctrlKey && key === `s`) {
        event.preventDefault()
        event.stopPropagation()

        onFeatureSave?.(feature)
      }
    },
    [
      feature,
      onFeatureSave
    ]
  )
  
  useEffect(() => {
    if(!containerRef.current) return

    containerRef?.current?.focus?.()
  }, [])
  

  return {
    onKeyDown,
  }
}