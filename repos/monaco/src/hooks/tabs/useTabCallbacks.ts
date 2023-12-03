import type { SyntheticEvent } from 'react'
import type { TFileMeta, TAutoSave, TModal } from '../../types'

import { useMemo } from 'react'
import { useOnTabClose } from './useOnTabClose'
import { useOnTabHover } from './useOnTabHover'
import { useInline } from '@gobletqa/components'
import { useFileType } from '../file/useFileType'

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

  const pathChange = useInline((e:SyntheticEvent<HTMLDivElement>) => {
    const key = e.currentTarget.dataset.src!
    key
      ? onPathChange?.(key)
      : console.warn(`Missing path src on current target's dataset`, e.currentTarget.dataset)
  })

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