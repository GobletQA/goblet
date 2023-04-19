import type { MutableRefObject, ReactNode } from 'react'

import { createPortal } from 'react-dom'
import { useEffect, useRef } from 'react'
import { useForceUpdate } from '@GBC/hooks/components/useForceUpdate'

export type TPortal = {
  id?:string
  warn?:boolean
  children:ReactNode
  elementRef?:MutableRefObject<HTMLElement>
}

export const Portal = (props:TPortal) => {
  const {
    id,
    warn,
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
      return warn ? console.warn(`Can not find Portal Dom element`) : undefined

    portalRef.current = element as HTMLElement
    if(elementRef) elementRef.current = portalRef.current

    forceUpdate()
  }, [id, warn])

  return portalRef.current
    ? createPortal(children, portalRef.current)
    : null
}