import type { TFileMeta, TAutoSave, TModal } from '../../types'
import type { SyntheticEvent } from 'react'

import { useOnTabClose } from './useOnTabClose'
import { useOnTabHover } from './useOnTabHover'
import { useFileType } from '../file/useFileType'

import { useCallback, useMemo } from 'react'

export type THTabCallbacks = {
  Modal: TModal
  file: TFileMeta
  autoSave: TAutoSave
  currentPath?: string
  rootEl: HTMLElement | null
  onCloseFile: (key: string) => void
  onSaveFile: (path: string) => void
  onAbortSave: (path: string) => void
  onPathChange?: (key: string) => void
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
  } = props

  const fileType = useFileType(file.path)

  const pathChange = useCallback(
    (e:SyntheticEvent<HTMLDivElement>) => {
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
    Modal,
    rootEl,
    autoSave,
    onSaveFile,
    onAbortSave,
    onCloseFile,
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
    closeVisible,
    setHoverRight,
    onPathChange: pathChange
  }
  
}