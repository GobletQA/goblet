import type {
  DragEvent,
  FocusEvent,
  MouseEventHandler,
  KeyboardEventHandler
} from 'react'


export enum EDndPos {
  after=`after`,
  before=`before`,
}

export type TDndDragCallback = <T=Element>(evt: DragEvent<T>|FocusEvent<T>) => void

export type TDndMouseHover = {
  onMouseEnter?:TDndDragCallback
  onMouseLeave?:TDndDragCallback
}

export type TDndOptionalCallbacks = TDndMouseHover & {
  onDragEnd?: TDndDragCallback
  onDragOver?: TDndDragCallback
  onDragEnter?: TDndDragCallback
  onDragStart?: TDndDragCallback
  onDragLeave?: TDndDragCallback
  onKeyDown?: KeyboardEventHandler<Element>
  onClick?: MouseEventHandler<HTMLDivElement>
}

export type TDndCallbacks<T=Record<string, any>> = TDndOptionalCallbacks & {
  onDrop: TOnDrop<T>
}

export type TOnDrop<T=Record<string, any>> = (
  oldIdx: number,
  newIdx: number,
  pos: EDndPos,
  oldData?:T,
  newData?:T,
) => Promise<void> | void