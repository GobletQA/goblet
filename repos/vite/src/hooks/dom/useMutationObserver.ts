import type { MutableRefObject } from 'react'
import { useMemo, useEffect } from 'react'
import { useInline } from '../useInline'
import { noOp } from '@keg-hub/jsutils'

export type TMutationObserver = {
  element?:Element
  selector?:string
  subtree?: boolean
  childList?: boolean
  attributes?: boolean
  cb?:MutationCallback
  elementRef?:MutableRefObject<Element | null>
}

const selectorsKeys = [`#`, `.`, `[`, `>`]

export const useMutationObserver = (props:TMutationObserver) => {
  const {
    cb=noOp,
    element,
    selector,
    elementRef,
    ...config
  } = props

  const callback = useInline(cb)

  const domNode = useMemo(() => {
    if(elementRef?.current) return elementRef.current

    if(element || !selector) return element

    const sel =  selectorsKeys.includes(selector[0]) ? selector :`#${selector}`
    document.querySelector(sel)

  }, [selector, element, elementRef?.current])
  
  useEffect(() => {
    if(!domNode) return

    const observer = new MutationObserver(callback)
    observer.observe(domNode, config)

    return () => {
      observer.disconnect()
    }
  }, [domNode])
}