import type { TMenuItem } from '@gobletqa/components'
import type { MutableRefObject, ComponentType, CSSProperties } from 'react'
import type { TSidebarAction, TSidebarActionExt } from './sidebar.types'

export type TEditorAction<
  TEditor=any,
  TEditorRef extends MutableRefObject<any>=MutableRefObject<any>
> = TSidebarAction<TEditor> & TSidebarActionExt<TEditorRef> & Partial<TMenuItem>

export type TBrowserActionCB = (
  evt:Event,
  editor:unknown,
  path:string,
  content:string
) => void

export type TBrowserAction = {
  id?:string
  key?:string
  name:string
  className?:string
  style?:CSSProperties
  onClick?: TBrowserActionCB
  containerSx?:CSSProperties
  containerClassName?: string
  Component?:ComponentType<any>
  sx?:CSSProperties|CSSProperties[]
  [key:string]: any
}

export type TBrowserActionProps = Omit<TBrowserAction, `Component`>