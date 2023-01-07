import type { Modal } from '../Modal/Modal'
import type { TSidebarPanel } from '@gobletqa/components'
import type { Dispatch, SetStateAction, MutableRefObject, CSSProperties } from 'react'
import type {
  TFolder,
  TRootDir,
  TFilelist,
  TEditorCB,
  TEditorConfig,
  TFileCallback,
} from '../../types'

import { FileTree } from '../FileTree'
import { Sidebar as GBSidebar } from '@gobletqa/components'

export type TSidebar = {
  Modal: Modal
  title?: string
  PrePanels?:TSidebarPanel[]
  Panels?:TSidebarPanel[]
  rootPrefix?: string
  currentPath?: string
  sidebarWidth?: number
  style?: CSSProperties
  config?: TEditorConfig
  sidebarStatus?: boolean
  defaultFiles: TFilelist
  onPathChange: TEditorCB
  onDeleteFile: TEditorCB
  onAddFile: TFileCallback
  onDeleteFolder: TEditorCB
  onAddFolder: TFileCallback
  rootEl: HTMLElement | null
  filetree: TFolder | TRootDir
  onEditFileName: TFileCallback
  onEditFolderName: TFileCallback
  filesRef: MutableRefObject<TFilelist>
  setFiletree: Dispatch<SetStateAction<TRootDir | TFolder>>
}

export const Sidebar = (props:TSidebar) => {

  const {
    style,
    Panels,
    PrePanels,
  } = props

  return (
    <GBSidebar
      style={style}
      Panels={Panels}
      PrePanels={PrePanels}
      className='goblet-editor-sidebar-main'
    >
      <FileTree {...props} />
    </GBSidebar>
  )
  
}