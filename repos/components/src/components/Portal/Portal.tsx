import type { MutableRefObject, ReactNode } from 'react'

import { createPortal } from 'react-dom'
import { useEffect, useRef, useMemo } from 'react'
import { useForceUpdate } from '@GBC/hooks/useForceUpdate'

export type TPortal = {
  id?:string
  children:ReactNode
  elementRef?:MutableRefObject<HTMLElement>
}

export const Portal = (props:TPortal) => {
  const {
    id,
    children,
    elementRef,
  } = props

  const portalRef = useRef<HTMLElement>()
  const forceUpdate = useForceUpdate()

  useEffect(() => {
    if(portalRef.current) return

    const element = elementRef?.current
      || id && document.getElementById(id) as HTMLElement

    if(!element)
      return console.warn(`Can not find Portal Dom element`)

    portalRef.current = element as HTMLElement
    forceUpdate()
  }, [id])

  return portalRef.current
    ? createPortal(children, portalRef.current)
    : null
}