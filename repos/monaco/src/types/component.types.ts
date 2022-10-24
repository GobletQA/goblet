
import type { editor } from 'monaco-editor'
import type { Modal } from '../components/Modal/Modal'
import type { TEditorTheme, TEditorConfig } from './editor.types'
import type { CSSProperties, ReactNode, ComponentType } from 'react'

export interface TFilelist {
  [key: string]: string | null
}

export interface IMonacoEditorProps {
  Modal: ComponentType
  title?: string
  emptyText?: string
  defaultPath?: string
  config?: TEditorConfig
  defaultFiles?: TFilelist
  initialFileTreeWidth?: number
  initialFileTreeStatus?: boolean
  onPathChange?: (key: string) => void
  onValueChange?: (v: string) => void
  onFileChange?: (key: string, value: string) => void
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