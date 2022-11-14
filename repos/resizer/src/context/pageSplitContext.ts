import { createContext } from 'react'
import { ZeroBoundingSize } from '../utils/boundingSize'
import { Proportional }  from '../resizes/Proportional'

const EmptyPanelsState = {
  sizes : [],
  elements : [],
  sizeProperty : "flexBasis"
}

type TEmptyPageSplitState = {
  drag: any
  event: any
  resize: any
  panels: any
  boundingSize: any
}

const EmptyPageSplitState:TEmptyPageSplitState = {
  drag: null,
  event: null,
  resize: Proportional,
  panels: EmptyPanelsState,
  boundingSize : ZeroBoundingSize,
}

export const NoopPageSplitDispatch = (...args:any[]):any => {}
export const PageSplitStateContext = createContext(EmptyPageSplitState)
export const PageSplitDispatchContext = createContext(NoopPageSplitDispatch)
