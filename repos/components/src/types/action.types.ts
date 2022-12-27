import type { MutableRefObject } from 'react'
import type { TSidebarAction, TSidebarActionExt } from './sidebar.types'


export type TAction<
  TEditor=any,
  TEditorRef extends MutableRefObject<any>=MutableRefObject<any>
> = TSidebarAction<TEditor> & TSidebarActionExt<TEditorRef>
