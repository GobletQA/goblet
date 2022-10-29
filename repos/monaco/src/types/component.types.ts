
import type { editor } from 'monaco-editor'

import type { Modal, TModalOpts } from '../components/Modal/Modal'
import type { TFilelist } from './file.types'
import type { TEditorTheme, TEditorConfig } from './editor.types'
import type { CSSProperties, ReactNode, ComponentType } from 'react'
import type {
  TEditorCB,
  TFileCallback,
  TEditorFileCB,
  TEditorPromiseCB,
} from './helpers.types'

export type TModal = Modal

export interface IMonacoEditorProps {
  title?: string
  Modal: TModalOpts
  rootPrefix?: string
  emptyText?: string
  defaultPath?: string
  config?: TEditorConfig
  defaultFiles?: TFilelist
  initialFileTreeWidth?: number
  initialFileTreeStatus?: boolean
  onPathChange?: TEditorCB
  onValueChange?: TEditorCB
  onLoadFile?: TEditorPromiseCB
  onFileChange?: TEditorFileCB
  onFileTreeResize?: (width:number) => void
  options: editor.IStandaloneEditorConstructionOptions
}

export interface IMultiRefType {
  getAllValue: () => TFilelist
  getValue: (path: string) => string | null
  getSupportThemes: () => Array<string>
  setTheme: (name: string, theme?:TEditorTheme) => void
}

export type TMonacoEditor = IMonacoEditorProps & {
  Loading?: ReactNode
}

export type TIcon = {
  title?: string
  size?: string
  height?: string
  width?: string
  color?:string
  fill?:string
  className?:string
  style?: CSSProperties
}

export type TFileProps = {
  file: any
  Modal: TModal
  root: boolean
  rootPrefix?:string
  currentPath?: string
  onAddFile: TFileCallback
  onAddFolder: TFileCallback
  onDeleteFile: TFileCallback
  onEditFileName: TFileCallback
  onDeleteFolder: TFileCallback
  onEditFolderName: TFileCallback
  onConfirmAddFile: TFileCallback
  onConfirmAddFolder: TFileCallback
  onPathChange: (key: string) => void
}
