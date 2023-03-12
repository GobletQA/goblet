import { useState, useEffect, useRef } from 'react'

export function useIntersect({
  root = null,
  rootMargin,
  threshold = 0,
}: IntersectionObserverInit) {
  const [node, setNode] = useState<Element>()
  const [entry, setEntry] = useState<IntersectionObserverEntry>({} as IntersectionObserverEntry)

  const observer = useRef(
    new IntersectionObserver(([entry]) => setEntry(entry), {
      root,
      threshold,
      rootMargin,
    })
  )

  useEffect(() => {
    const { current: currentObserver } = observer
    currentObserver.disconnect()

    if (node) {
      currentObserver.observe(node)
    }

    return () => {
      currentObserver.disconnect()
    }
  }, [node])

  return [setNode, entry]
}
