
import type Monaco from 'monaco-editor'
import type { editor } from 'monaco-editor'
import type { MutableRefObject } from 'react'

export type TOpenMode = `keep` | `preview`
export type TAutoSave = `blur` | `change` | `off`
export type TEditorCB = (data: string) => void
export type TFileCallback = (...args: any[]) => void
export type TCodeEditor = editor.IStandaloneCodeEditor
export type TCodeEditorRef = MutableRefObject<TCodeEditor|undefined>
export type TEditorFileCB = (path:string, content: string) => void
export type TEditorPromiseCB = (data: string) => Promise<string|null>
export type TEditorAddFile = (path:string, isFolder?: boolean) => void
export type TEditorDeleteFile = (path:string, isFolder?: boolean) => void
export type TEditorRenameFile = (oldLoc:string, newLoc: string) => void
export type TOnEditorLoaded = (editor:TCodeEditor, monaco:typeof Monaco) => void
export type TEditorFileCBRef = MutableRefObject<TEditorFileCB | undefined>
export type TEditorOpts = editor.IStandaloneEditorConstructionOptions & {
  autoSave?: TAutoSave
  openMode?: TOpenMode
}
