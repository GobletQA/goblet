import type { MutableRefObject } from "react"
import { useMemo, useRef } from "react"

export type TEnsureRef<T=HTMLElement> = MutableRefObject<T | undefined>

export const useEnsureRef = <T>(ensureRef?:TEnsureRef<T>) => {
  const localRef = useRef<TEnsureRef>(null)
  return useMemo(() => (ensureRef || localRef) as TEnsureRef<T>, [ensureRef])
}
