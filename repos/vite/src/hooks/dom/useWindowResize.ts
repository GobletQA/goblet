import { useEffect, useState } from 'react'
import { debounce } from '@keg-hub/jsutils'

type TResizeHandler = (ev: UIEvent) => any
type TWindowSize = {
  height: number
  width: number
}

type ResizeProps = {
  wait?: number
  onResize: (size: TWindowSize, evt: UIEvent) => void
}

export const useWindowResize = ({ wait = 250, onResize }: ResizeProps) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    const handler = (evt: UIEvent) => {
      const size = { width: window.innerWidth, height: window.innerHeight }
      setWindowSize(size)
      onResize?.(size, evt)
    }

    // Debounce to avoid the function fire multiple times
    const debouncedResize = debounce(handler, wait, false) as unknown as TResizeHandler
    // Add the debounced method as the resize listener on the window
    window.addEventListener('resize', debouncedResize)

    // Cleanup the listner on unmount
    return () => window.removeEventListener('resize', debouncedResize)
  }, [wait, onResize])

  return windowSize
}
