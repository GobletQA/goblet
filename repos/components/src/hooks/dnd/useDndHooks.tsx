import type {
  CSSProperties,
  MutableRefObject,
} from 'react'
import type { TDndCallbacks } from '@GBC/types'

import { useDndRefs } from './useDndRefs'
import { useShowHide } from './useShowHide'
import { useDragHooks } from './useDragHooks'
import { useDndEventHooks } from './useDndEventHooks'

export type THDndHooks = TDndCallbacks & {
  data?:string
  index: number
  exact?:boolean
  parentTypes?:string[]
  showDragHandle?: boolean
  dragHandleSx?:CSSProperties
  dragImagePos?:[number, number]
  dragHandleRef?: MutableRefObject<HTMLElement>
}

export const useDndHooks = (props:THDndHooks) => {

  const {
    data,
    index,
    exact,
    parentTypes,
    dragHandleSx,
    showDragHandle = false,
    onKeyDown,
  } = props

  const dndRefs = useDndRefs(props)

  const dragHooks = useDragHooks({
    data,
    index,
    parentTypes,
    ...dndRefs,
  })

  const showHideHooks = useShowHide({
    parentTypes,
    dragHandleSx,
    showDragHandle,
    ...dndRefs,
  })

  const keyDownHooks = useDndEventHooks({
    data,
    exact,
    index,
    parentTypes,
    onKeyDown,
    ...dndRefs,
    ...showHideHooks,
  })

  return {
    ...dndRefs,
    // dndRefs and dragHooks both have methods with the same names
    // But dragHooks wraps the methods in dndRefs
    // So make sure it comes after dndRefs
    ...dragHooks,
    ...keyDownHooks,
    ...showHideHooks,
  }

}