import type { MutableRefObject } from 'react'
import type { TXTermIdMap, TXTerminal, TXTermRef } from '@types'

import { useEffect, useRef } from 'react'
import { noOpObj } from '@keg-hub/jsutils'
import { XTerminal } from '@services/xterm'

export const useXTerminal = (props:Partial<TXTerminal>=noOpObj, id?:string) => {
  const termId:string = id || props.id || ``
  const termRefs = useRef<TXTermIdMap>({} as TXTermIdMap)

  const existing = termRefs.current?.[termId]?.element
  const termElRef = useRef<HTMLDivElement|null>(existing?.current || null)

  useEffect(() => {
    if(existing || !termId || termRefs?.current?.[termId] || !termElRef?.current) return

      termRefs.current[termId] = {
        element: termElRef,
        term: new XTerminal({
          ...props,
          id: termId,
          element: termElRef.current
        }),
        remove: () => {
          termRefs.current[termId]
            && termRefs.current?.[termId]?.term?.remove?.()

          delete termRefs.current[termId]
        }
      }
  }, [props, termId])

  const activeRef = termRefs.current[termId] || { element: termElRef }

  return [activeRef, termRefs] as [TXTermRef, MutableRefObject<TXTermIdMap>]
}