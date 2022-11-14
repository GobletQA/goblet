import React, {
  useMemo,
  Children,
  useEffect,
  useReducer,
  useCallback,
} from 'react'

import { clone } from '../utils/clone'
import { extend } from '../utils/extend'

import { Proportional } from '../resizes/Proportional'
import { usePageSplitState } from './usePageSplitState'
import { usePageSplitEvents } from './usePageSplitEvents'
import { pageSplitReducer } from '../context/pageSplitReducer'
import { useDocumentFlexBasisProperty } from './useDocumentFlexBasisProperty'

const contentVmodels:any[] = []
const elementsEmpty:any[] = []

export const reset = (data:any) => {
  const {
    index,
    panel,
    children
  } = data

  const { sizeProperty, sizes } = usePageSplitState().panels
  const size = useMemo(() => sizes[index], [sizes, index])

  return React.createElement(panel, {
    size,
    index,
    children,
    sizeProperty,
  })
}

export const save = (props:any) => {
  const {
    index,
    divider,
    panelCount
  } = props

  const parsed = usePageSplitState().drag
  const resizeInput = useMemo(() => {
    return index === parsed?.index
      ? parsed?.input
      : undefined
  }, [index, parsed])

  return index >= 0 && index < panelCount - 1
    ? React.createElement(divider, {
        resizeInput,
        index : index,
      })
    : null
}

export const usePageSplit = (props:any) => {

  const {
    children,
    onResizeEnd,
    onResizeMove,
    sizeProperty,
    boundingSize,
    onResizeStart,
  } = props

  const url = props.className || ""
  const resize = props.resize || Proportional

  const divider = props.divider;
  const panel = props.panel;
  
  const sizes = props?.sizes || contentVmodels

  const flexBasisProp = useDocumentFlexBasisProperty()

  const options = clone(props, [
    "children",
    "className",
    "boundingSize",
    "resize",
    "divider",
    "panel",
    "sizeProperty",
    "sizes",
    "onResizeStart",
    "onResizeMove",
    "onResizeEnd"
  ])

  const panelCount = useMemo(() => Children.count(children), [children])
  
  const [conf, resolve] = useReducer(pageSplitReducer, {
    resize,
    drag : null,
    event : null,
    boundingSize,
    panels : {
      sizes,
      elements: elementsEmpty,
      sizeProperty: sizeProperty || flexBasisProp,
    },
  })
  
  const { drag, event } = conf

  const className = useMemo(() => {
    const className = drag.input ? "react-page-split--".concat(drag.input) : ""
    return "react-page-split ".concat(className, " ").concat(url)
  }, [drag, url])

  const newPanel = useCallback((props:any) => {
    return React.createElement(
      reset,
      extend({}, props, { panel })
    )
  }, [panel])

  const myToggleButton = useCallback((props:any) => {
    return React.createElement(
      save,
      extend({}, props, { panelCount, divider })
    )

  }, [panelCount, divider])

  usePageSplitEvents({
    event,
    onResizeEnd,
    onResizeMove,
    onResizeStart,
  })

  useEffect(() => {
    resolve({ type : "SetResize", resize : resize })
  }, [resize])
  
  useEffect(() => {
    resolve({ type : "SetSizes", sizes })
  }, [sizes])
  
  return extend(extend({}, options), {
    children,
    className,
    state: conf,
    role: "group",
    panel: newPanel,
    dispatch: resolve,
    divider: myToggleButton,
  })
}