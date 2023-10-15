import type { MutableRefObject } from "react"
import { useMemo, useRef } from "react"

export type TEnsureRef = MutableRefObject<HTMLElement | undefined>

export const useEnsureRef = (ensureRef?:TEnsureRef) => {
  const localRef = useRef<TEnsureRef>(null)
  return useMemo(() => (ensureRef || localRef) as MutableRefObject<T>, [ensureRef])
}
