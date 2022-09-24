import type { editor } from 'monaco-editor'


export type TTSCompileOpts = {
  allowJs: boolean
  allowNonTsExtensions: boolean
  allowSyntheticDefaultImports: boolean
}

export interface TFilelist {
  [key: string]: string
}

export type TEditorThemeConfig = {
  name: string
  theme: TEditorTheme
}

export type TTSConfig = {
  defaults: any
  compileOptions: TTSCompileOpts
}

export type TMonacoConfig = {
  languages?: string[]
  typescript?: TTSConfig
  [key: string]: any
}

export type TEditorConfig = {
  extraLibs: any
  monaco?: TMonacoConfig
  theme?: TEditorThemeConfig
  [key: string]: any
}


export type TEditorTheme = editor.IStandaloneThemeData & {
  [key: string]: any
}

export type TEditorThemes = {
  [key: string]: TEditorTheme
  
}