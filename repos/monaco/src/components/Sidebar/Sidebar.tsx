import type { Modal } from '../Modal/Modal'
import type { TSidebarPanel, TPortal } from '@gobletqa/components'
import type { Dispatch, SetStateAction, MutableRefObject, CSSProperties } from 'react'
import type {
  TFolder,
  TRootDir,
  TFilelist,
  TEditorCB,
  TEditorConfig,
  TFileCallback,
} from '../../types'

import { useMemo } from 'react'
import { FileTree } from '../FileTree'
import { isStr } from '@keg-hub/jsutils'
import {
  Sidebar as GBSidebar,
  SidebarPortal as GBSidebarPortal
} from '@gobletqa/components'

export type TSidebar = {
  Modal: Modal
  title?: string
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
  Panels?:TSidebarPanel[]
  PrePanels?:TSidebarPanel[]
  onDeleteFolder: TEditorCB
  onAddFolder: TFileCallback
  rootEl: HTMLElement | null
  filetree: TFolder | TRootDir
  onEditFileName: TFileCallback
  onEditFolderName: TFileCallback
  filesRef: MutableRefObject<TFilelist>
  portal?:string|MutableRefObject<HTMLElement>
  setFiletree: Dispatch<SetStateAction<TRootDir | TFolder>>
}

const RenderSidebar = (props:TSidebar) => {
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

export const Sidebar = (props:TSidebar) => {

  const {portal, ...rest} = props

  const portalProps = useMemo(() => {
    if(!portal) return
    const portalProps = {} as Partial<TPortal>
    isStr(portal)
      ? portalProps.id = portal
      : portalProps.elementRef = portal

    return portalProps
  }, [portal])


  return portalProps
    ? (
        <GBSidebarPortal {...portalProps}>
          <RenderSidebar {...rest} />
        </GBSidebarPortal>
      )
    : (<RenderSidebar {...rest} />)
  
}