
import type { editor } from 'monaco-editor'
import type Monaco from 'monaco-editor'

export type TFileCallback = (...args: any[]) => void
export type TEditorCB = (data: string) => void
export type TEditorPromiseCB = (data: string) => Promise<string|null>
export type TEditorFileCB = (path:string, content: string) => void
export type TEditorOpts = editor.IStandaloneEditorConstructionOptions
export type TEditorAddFile = (path:string, isFolder?: boolean) => void
export type TEditorDeleteFile = (path:string, isFolder?: boolean) => void
export type TEditorRenameFile = (oldLoc:string, newLoc: string) => void
export type TOnEditorLoaded = (editor:editor.IStandaloneCodeEditor, monaco:typeof Monaco) => void