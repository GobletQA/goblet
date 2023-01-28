import type { MouseEvent } from 'react'
import type { TResizeSideBarEvent } from '@GBC/types'

import { useRef, useMemo, useCallback, useState } from 'react'
import { exists } from '@keg-hub/jsutils'
import { useEventListen } from '@GBC/hooks/useEvent'
import { ResizeSideBarEvent, DefSidebarWidth } from '@GBC/constants'

export type TDragObj = {
  pageX: number
  width: number
  start: boolean
}

export type TUseSidebarResize = {
  maxWidth?:number
  initialWidth?: number
  initialStatus?:boolean
  onSidebarResize?: (width:number) => void
}

export const useSidebarResize = (props:TUseSidebarResize) => {

  const {
    onSidebarResize,
    initialStatus=false,
    maxWidth=DefSidebarWidth,
    initialWidth=maxWidth,
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
        start: true,
        pageX: e.pageX,
        width: sidebarWidth,
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
    () => {
      // Only animate the sidebar widht when not manually resizing
      return !dragStartRef?.current?.start
        ? { width: `${sidebarWidth}px` }
        : { width: `${sidebarWidth}px`, transition: `none` }
    },
    [maxWidth, sidebarWidth]
  )

  const resizeSidebar = useCallback((width:number) => {
    setSidebarWidth(width)
    onSidebarResize?.(width)
  }, [onSidebarResize, setSidebarWidth])

  useEventListen<TResizeSideBarEvent>(ResizeSideBarEvent, ({ size, toggle }) => {
    if(exists(size)) return resizeSidebar?.(size)
    if(!toggle) return
    
    sidebarWidth > 0 ? resizeSidebar?.(0) : resizeSidebar?.(DefSidebarWidth)

  })


  return {
    styles,
    onMove,
    maxWidth,
    onMoveEnd,
    onMoveStart,
    dragStartRef,
    sidebarWidth,
    resizeSidebar,
    setSidebarWidth,
  }

}
