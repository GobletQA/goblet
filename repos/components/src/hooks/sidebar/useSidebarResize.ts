import type { MouseEvent } from 'react'
import { useRef, useMemo, useCallback, useState } from 'react'

export type TDragObj = {
  pageX: number
  width: number
  start: boolean
}

export type TUseSidebarResize = {
  initialWidth?: number
  initialStatus?:boolean
  onSidebarResize?: (width:number) => void
}

export const useSidebarResize = (props:TUseSidebarResize) => {

  const {
    onSidebarResize,
    initialWidth=200,
    initialStatus=false
  } = props


  const [sidebarWidth, setSidebarWidth] = useState<number>(initialStatus ? initialWidth : 0)

  const dragStartRef = useRef<TDragObj>({
    pageX: 0,
    width: 0,
    start: false,
  })

  const onMoveStart = useCallback(
    (e:MouseEvent) => {
      dragStartRef.current = {
        pageX: e.pageX,
        width: sidebarWidth,
        start: true,
      }
    },
    [sidebarWidth]
  )

  const onMove = useCallback((e:MouseEvent) => {
    if (dragStartRef.current.start) {
      setSidebarWidth(
        dragStartRef.current.width + (e.pageX - dragStartRef.current.pageX)
      )
    }
  }, [])

  const onMoveEnd = useCallback((e:MouseEvent) => {
    dragStartRef.current = {
      pageX: e.pageX,
      width: 0,
      start: false,
    }
  }, [])

  const styles = useMemo(
    () => ({
      width: `${sidebarWidth}px`,
    }),
    [sidebarWidth]
  )

  const resizeSidebar = useCallback((width:number) => {
    setSidebarWidth(width)
    onSidebarResize?.(width)
  }, [onSidebarResize, setSidebarWidth])

  return {
    styles,
    onMove,
    onMoveEnd,
    onMoveStart,
    dragStartRef,
    sidebarWidth,
    resizeSidebar,
    setSidebarWidth,
  }

}
