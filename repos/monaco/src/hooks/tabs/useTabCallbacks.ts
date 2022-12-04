import type { TAutoSave, TModal } from '../../types'


import { useOnTabDown } from './useOnTabDown'
import { useOnTabClose } from './useOnTabClose'
import { useOnTabHover } from './useOnTabHover'
import { useFileType } from '../file/useFileType'

import { useCallback, useMemo } from 'react'

export type THTabCallbacks = {
  Modal: TModal
  autoSave: TAutoSave
  currentPath?: string
  rootEl: HTMLElement | null
  onCloseFile: (key: string) => void
  onSaveFile: (path: string) => void
  onAbortSave: (path: string) => void
  onPathChange?: (key: string) => void
  onCloseOtherFiles: (path: string) => void
  file: { path: string, status?: string }
}

export type THCloseVisible = {
  hover: boolean
  active: boolean
  status?: string,
  hoverRight: boolean
}

const useCloseVisible = ({
  hover,
  status,
  active,
  hoverRight,
}:THCloseVisible) =>{
  return useMemo(() => {
    let closeVisible = true
    if (status === 'editing' && !hoverRight)
      closeVisible = false

    else if (status !== 'editing' && !hover && !active)
      closeVisible = false

    return closeVisible
  }, [
    hover,
    status,
    active,
    hoverRight,
  ])
}

export const useTabCallbacks = (props:THTabCallbacks, active:boolean) => {
  
  const {
    file,
    Modal,
    rootEl,
    autoSave,
    onSaveFile,
    onAbortSave,
    onCloseFile,
    onPathChange,
    onCloseOtherFiles
  } = props

  const fileType = useFileType(file.path)

  const pathChange = useCallback(
    (e:any) => {
      const key = e.currentTarget.dataset.src!
      onPathChange && onPathChange(key)
    },
    [onPathChange]
  )

  const {
    hover,
    setHover,
    handleOver,
    hoverRight,
    handleLeave,
    setHoverRight,
  } = useOnTabHover()

  const onTabClose = useOnTabClose({
    file,
    Modal,
    rootEl,
    autoSave,
    onSaveFile,
    onAbortSave,
    onCloseFile,
  })

  const onMouseDown = useOnTabDown({
    file,
    Modal,
    onTabClose,
    onCloseOtherFiles
  })

  const closeVisible = useCloseVisible({
    hover,
    active,
    hoverRight,
    status: file.status,
  })


  return {
    hover,
    setHover,
    fileType,
    handleOver,
    hoverRight,
    onTabClose,
    handleLeave,
    onMouseDown,
    closeVisible,
    setHoverRight,
    onPathChange: pathChange
  }
  
}