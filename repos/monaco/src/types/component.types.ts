
import type { editor } from 'monaco-editor'
import type { CSSProperties, ReactNode } from 'react'
import type { TEditorTheme, TEditorConfig } from './editor.types'

export interface TFilelist {
  [key: string]: string | null
}

export interface IMonacoEditorProps {
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