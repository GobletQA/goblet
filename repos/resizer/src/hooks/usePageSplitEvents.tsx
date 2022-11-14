import { useEffect } from 'react'

export const usePageSplitEvents = (props:any) => {
  const {
    event,
    onResizeEnd,
    onResizeMove,
    onResizeStart,
  } = props

  useEffect(() => {
    switch(event?.type){
      case "ResizeStart": {
        onResizeStart?.(event)
        break
      }
      case "ResizeMove": {
        onResizeMove?.(event)
        break
      }
      case "ResizeEnd": {
        onResizeEnd?.(event)
        break
      }
    }
  }, [
    event,
    onResizeEnd,
    onResizeMove,
    onResizeStart,
  ])

}