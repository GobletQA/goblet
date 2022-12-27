import type { Modal } from '../Modal/Modal'
import type { MutableRefObject, CSSProperties } from 'react'
import type {
  TFilelist,
  TEditorCB,
  TSidebarPanel,
  TEditorConfig,
  TFileCallback,
} from '../../types'

import { FileTree } from '../FileTree'
import { Sidebar as GBSidebar } from '../../goblet'

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
  onEditFileName: TFileCallback
  onEditFolderName: TFileCallback
  filesRef: MutableRefObject<TFilelist>
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