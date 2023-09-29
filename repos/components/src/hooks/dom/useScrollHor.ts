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
      if (Math.abs(evt.deltaX) >= Math.abs(evt.deltaY) || evt.deltaY == 0 || !scrollRef.current)
        return

      evt.preventDefault()

      scrollRef?.current?.scrollBy?.({
        behavior: `smooth`,
        left: evt.deltaY * 3,
      })
    }

    scrollRef?.current.addEventListener(`wheel`, onScroll)

    return () => {
      scrollRef?.current?.removeEventListener?.(`wheel`, onScroll)
    }
    
  }, [])

  return { scrollRef }

}