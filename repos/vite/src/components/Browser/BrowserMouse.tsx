import { CSSProperties, ReactNode } from "react"
import { useCallback, useState, useEffect } from "react"


const useMousePosition = (props:TBrowserMouse) => {
  const { x=0, y=0 } = props

  const [style, setStyle] = useState<CSSProperties>({
    top: 0,
    left: 0,
    opacity: 0,
    zIndex: 3000,
    position: `fixed`
  })


  useEffect(() => {

    const updatePosition = (event:MouseEvent) => {
      const { clientX, clientY } = event
      setStyle({ ...style, left: clientX + x, top: clientY + y })
    }

    document.addEventListener(`mousemove`, updatePosition)
    document.addEventListener(`mouseenter`, updatePosition)

    return () => {
      document.removeEventListener(`mousemove`, updatePosition)
      document.removeEventListener(`mouseenter`, updatePosition)
    }
  }, [])

  return style
}


export type TBrowserMouse = {
  x?:number
  y?:number
  children?:ReactNode
}


export const BrowserMouse = (props:TBrowserMouse) => {
  const { children } = props
  const style = useMousePosition(props)

  return (
    <div className='gb-browser-mouse-follow' style={style} >
      {children}
    </div>
  )
}