import type {
  MutableRefObject,
  MouseEventHandler,
  KeyboardEventHandler
} from 'react'

import { useDndRefs } from './useDndRefs'
import { useShowHide } from './useShowHide'
import { useDragHooks } from './useDragHooks'
import { useDndEventHooks } from './useDndEventHooks'

export type TOnDrop = (
  oldIdx: number,
  newIdx: number,
  oldData?:string,
  newData?:string
) => Promise<void> | void

export type THDndHooks = {
  data?:string
  index: number
  exact?:boolean
  onDrop: TOnDrop
  showHandle?: boolean
  dragImagePos?:[number, number]
  onKeyDown?: KeyboardEventHandler<Element>
  onClick?: MouseEventHandler<HTMLDivElement>
  dragHandleRef?: MutableRefObject<HTMLElement>
}

export const useDndHooks = (props:THDndHooks) => {

  const {
    data,
    index,
    exact,
    onDrop,
    showHandle = false,
    onKeyDown,
  } = props

  const dndRefs = useDndRefs(props)

  const dragHooks = useDragHooks({
    data,
    index,
    onDrop,
    ...dndRefs,
  })

  const showHideHooks = useShowHide({
    showHandle,
    ...dndRefs,
  })

  const keyDownHooks = useDndEventHooks({
    data,
    exact,
    index,
    onDrop,
    onKeyDown,
    ...dndRefs,
    ...showHideHooks,
  })

  return {
    ...dndRefs,
    ...dragHooks,
    ...keyDownHooks,
    ...showHideHooks,
  }

}