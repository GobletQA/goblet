import type { MutableRefObject } from "react"
import { useEffect, useRef} from "react"


export type THScrollHor = {
  ref?:MutableRefObject<HTMLElement>
}

export const useScrollHor = (props:THScrollHor={}) => {
  const { ref } = props
  
  const scrollRef = useRef<HTMLElement>(ref?.current || null) as MutableRefObject<HTMLElement>

  useEffect(() => {
    if(!scrollRef.current && !ref?.current) return

    if(ref?.current && scrollRef?.current !== ref?.current)
      scrollRef.current = ref.current

    const onScroll = (evt:any) => {
      if (evt.deltaY == 0) return
      evt.preventDefault()

      const magnitude = evt.deltaX !== 0 ? evt.deltaX : evt.deltaY > 0 ? -100 : 100
      scrollRef?.current.scrollBy({
        left: magnitude,
        behavior: `auto`
      })
    }

    scrollRef?.current.addEventListener(`wheel`, onScroll)

    return () => {
      scrollRef?.current?.removeEventListener?.(`wheel`, onScroll)
    }
    
  }, [])

  return { scrollRef }

}