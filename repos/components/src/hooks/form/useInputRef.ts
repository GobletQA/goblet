import type { MutableRefObject, RefObject } from 'react'

import { useRef, useMemo } from 'react'

type TInputType = HTMLInputElement | HTMLTextAreaElement | undefined

export type THInputRef = {
  inputRef?:RefObject<TInputType>|MutableRefObject<TInputType>
}

export const useInputRef = (props:THInputRef) => {
  const localInputRef = useRef<TInputType>(null)
  return useMemo(() => (props.inputRef || localInputRef) as MutableRefObject<TInputType>, [props.inputRef])
}