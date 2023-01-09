import type { MutableRefObject, ComponentType } from 'react'

export type TSidebarActionCB<TEditor=unknown> = (
  evt:Event,
  editor:TEditor,
  path:string,
  content:string
) => void

export type TSidebarAction<TEditor=unknown> = {
  id?:string
  name:string
  className?:string
  onClick?: TSidebarActionCB<TEditor>
  Component:ComponentType<any>
  [key:string]: any
}

export type TSidebarActionProps = {
  id?:string
  name?:string
  className?:string
  activeFile?:string
  onClick?: (...args:any[]) => void
}

export type TSidebarActionExt<TEditorRef=MutableRefObject<unknown>> = {
  curPath:string
  editorRef: TEditorRef
  curValueRef: MutableRefObject<string>
}