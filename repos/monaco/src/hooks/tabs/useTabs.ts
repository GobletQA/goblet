import type { TTabItem, TTab } from '@gobletqa/components'
import type {  TFileMeta, TAutoSave, TModal } from '@GBM/types'

import { useCallback, useMemo } from 'react'
import { useOnTabClose } from './useOnTabClose'
import { useInline } from '@gobletqa/components'
import { fileToTab } from '@GBM/utils/file/fileTabs'

export type THTabCallbacks = {
  Modal: TModal
  autoSave: TAutoSave
  currentPath?: string
  openedFiles: TFileMeta[]
  rootEl: HTMLElement | null
  onCloseFile: (key: string) => void
  onSaveFile: (path: string) => void
  onAbortSave: (path: string) => void
  onPathChange?: (key: string) => void
}


export const useTabs = (props:THTabCallbacks) => {
  const {
    Modal,
    rootEl,
    autoSave,
    onSaveFile,
    currentPath,
    openedFiles,
    onAbortSave,
    onCloseFile,
    onPathChange,
  } = props

  const openedTabs = useMemo<TTabItem[]>(() => {
    return openedFiles?.length
      ? openedFiles.map(file => fileToTab(file, { active: file.path === currentPath }))
      : []
  }, [openedFiles, currentPath])

  const onTabClick = useInline((tab:TTab) => tab?.path && onPathChange?.(tab.path))

  const onTabClose = useOnTabClose({
    Modal,
    rootEl,
    autoSave,
    onSaveFile,
    onAbortSave,
    onCloseFile,
  })

  return {
    openedTabs,
    onTabClose,
    onTabClick,
  }
}