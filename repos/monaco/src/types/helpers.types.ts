import type Monaco from 'monaco-editor'
import type { editor } from 'monaco-editor'
import type { MutableRefObject } from 'react'

export type TMonaco = typeof Monaco
export type ICodeEditor = editor.ICodeEditor
export type IEditor = editor.IStandaloneCodeEditor | null


export type TOpenMode = `keep` | `preview`
export type TAutoSave = `blur` | `change` | `off`
export type TEditorCB = (data: string) => void
export type TFileCallback = (...args: any[]) => void
export type TCodeEditor = editor.IStandaloneCodeEditor
export type TCodeEditorRef = MutableRefObject<TCodeEditor|undefined>
export type TEditorPromiseCB = (data: string) => Promise<string|null>
export type TEditorAddFile = (path:string, isFolder?: boolean) => void
export type TEditorRenameFile = (oldLoc:string, newLoc: string) => void
export type TEditorDeleteFile = (path:string, isFolder?: boolean) => void
export type TEditorFileCBRef = MutableRefObject<TEditorFileCB | undefined>
export type TEditorFileCB = (location:string, content: string|null) => void
export type TEditorPathCB = (location:string, content: string|null, opts:TPathChangeOpts) => void
export type TEditorPathCBRef = MutableRefObject<TEditorPathCB | undefined>

export type TOnEditorLoaded = (editor:TCodeEditor, monaco:typeof Monaco) => void
export type TEditorOpts = editor.IStandaloneEditorConstructionOptions & {
  autoSave?: TAutoSave
  openMode?: TOpenMode
  semanticHighlighting?: true | false | 'configuredByTheme'
}
export type TAddFileCB = ({
  content,
  isFolder,
  location,
}:{
  content?:string
  isFolder?:boolean
  location:string
}) => void


export type TPathChangeOpts = {
  oldLoc?:string
  setLoc?:boolean
  openLoc?:boolean
  storage?:boolean
}

export type TPathChange = (loc:string, opts?:TPathChangeOpts) => void