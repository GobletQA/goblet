
import type { editor } from 'monaco-editor'
import type { Modal } from '../components/Modal/Modal'
import type { TFilelist } from './file.types'
import type { TEditorTheme, TEditorConfig } from './editor.types'
import type { CSSProperties, ReactNode, ComponentType } from 'react'

export type TModal = Modal

export interface IMonacoEditorProps {
  Modal: ComponentType
  title?: string
  rootPrefix?: string
  emptyText?: string
  defaultPath?: string
  config?: TEditorConfig
  defaultFiles?: TFilelist
  initialFileTreeWidth?: number
  initialFileTreeStatus?: boolean
  onPathChange?: (key: string) => void
  onValueChange?: (v: string) => void
  onFileTreeResize?: (width:number) => void
  onLoadFile?: (path: string) => Promise<string|null>
  onFileChange?: (key: string, content: string) => void
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

export type TFileCallback = (...args: any[]) => void

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
