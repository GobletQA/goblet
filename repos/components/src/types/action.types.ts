import type { MutableRefObject, ComponentType } from 'react'
import type { TSidebarAction, TSidebarActionExt } from './sidebar.types'

export type TEditorAction<
  TEditor=any,
  TEditorRef extends MutableRefObject<any>=MutableRefObject<any>
> = TSidebarAction<TEditor> & TSidebarActionExt<TEditorRef>

export type TBrowserActionCB = (
  evt:Event,
  editor:unknown,
  path:string,
  content:string
) => void

export type TBrowserAction = {
  id?:string
  name:string
  className?:string
  onClick?: TBrowserActionCB
  Component:ComponentType<any>
  [key:string]: any
}

export type TBrowserActionProps = {
  id?:string
  name?:string
  className?:string
  activeFile?:string
  onClick?: (...args:any[]) => void
}