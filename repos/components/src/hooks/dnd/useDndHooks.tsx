import type {
  MutableRefObject,
  MouseEventHandler,
  KeyboardEventHandler
} from 'react'

import { useDndRefs } from './useDndRefs'
import { useShowHide } from './useShowHide'
import { useDragHooks } from './useDragHooks'
import { useDndEventHooks } from './useDndEventHooks'

export type TOnDrop = (droppedIndex: number, index: number) => Promise<void> | void

export type THDndHooks = {
  index: number
  onDrop: TOnDrop
  showHandle?: boolean
  onKeyDown?: KeyboardEventHandler<Element>
  onClick?: MouseEventHandler<HTMLDivElement>
  dragHandleRef?: MutableRefObject<HTMLElement>
}

export const useDndHooks = (props:THDndHooks) => {

  const {
    index,
    onDrop,
    showHandle = false,
    onKeyDown,
  } = props

  const dndRefs = useDndRefs(props)

  const dragHooks = useDragHooks({
    index,
    onDrop,
    ...dndRefs,
  })

  const showHideHooks = useShowHide({
    showHandle,
    ...dndRefs,
  })

  const keyDownHooks = useDndEventHooks({
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