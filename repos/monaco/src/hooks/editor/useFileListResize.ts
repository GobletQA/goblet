import { useRef, useMemo, useCallback, useState } from 'react'

export type TDragObj = {
  pageX: number
  width: number
  start: boolean
}

export type TUseFileListResize = {
  initialWidth?: number
  initialStatus?:boolean
  onFileTreeResize?: (width:number) => void
}

export const useFileListResize = (props:TUseFileListResize) => {

  const {
    onFileTreeResize,
    initialWidth=200,
    initialStatus=false
  } = props


  const [fileListWidth, setFileListWidth] = useState<number>(initialStatus ? initialWidth : 0)

  const dragStartRef = useRef<TDragObj>({
    pageX: 0,
    width: 0,
    start: false,
  })

  const handleMoveStart = useCallback(
    (e:any) => {
      dragStartRef.current = {
        pageX: e.pageX,
        width: fileListWidth,
        start: true,
      }
    },
    [fileListWidth]
  )

  const handleMove = useCallback((e:any) => {
    if (dragStartRef.current.start) {
      setFileListWidth(
        dragStartRef.current.width + (e.pageX - dragStartRef.current.pageX)
      )
    }
  }, [])

  const handleMoveEnd = useCallback((e:any) => {
    dragStartRef.current = {
      pageX: e.pageX,
      width: 0,
      start: false,
    }
  }, [])

  const styles = useMemo(
    () => ({
      width: `${fileListWidth}px`,
    }),
    [fileListWidth]
  )

  const resizeFileTree = useCallback((width:number) => {
    setFileListWidth(width)
    onFileTreeResize?.(width)
  }, [onFileTreeResize, setFileListWidth])

  return {
    styles,
    dragStartRef,
    handleMove,
    handleMoveEnd,
    handleMoveStart,
    fileListWidth,
    resizeFileTree,
    setFileListWidth,
  }

}