import { useCallback, useState } from 'react'

export type THOnTabHover = {}

export const useOnTabHover = (props?:THOnTabHover) => {

  const [hover, setHover] = useState(false)
  const [hoverRight, setHoverRight] = useState(false)
  const handleOver = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement) {
      e.target.dataset.name === 'editing'
        ? setHoverRight(true)
        : setHoverRight(false)
    }

    setHover(true)
  }

  const handleLeave = useCallback(() => {
    setHover(false)
    setHoverRight(false)
  }, [])

  return {
    hover,
    setHover,
    handleOver,
    hoverRight,
    handleLeave,
    setHoverRight,
  }

}