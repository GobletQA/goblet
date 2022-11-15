import { useMemo, useState } from 'react'
import { deepMerge } from '@keg-hub/jsutils'
import { clone } from '../utils/clone'
import { useDividerMouseEvents } from './useDividerMouseEvents'
import { useDividerTouchEvents } from './useDividerTouchEvents'
import { useDividerKeyboardEvents } from './useDividerKeyboardEvents'


export const useDivider = (props:any) => {

  const {
    index,
    onBlur,
    onFocus,
    resizeInput,
    onMouseDown,
    onTouchStart,
    mouseCoordinate,
    touchCoordinate,
    keyboardCoordinate,
  } = props

  const role = props.role ?? "separator"
  const label = props["aria-label"] || "Resize"

  const className = props?.className ?? ""
  
  const options = clone(props, [
    "index",
    "resizeInput",
    "mouseCoordinate",
    "keyboardCoordinate",
    "touchCoordinate",
    "onMouseDown",
    "onTouchStart",
    "onFocus",
    "onBlur",
    "role",
    "aria-label",
    "className"
  ])

  const container = useState(null)
  const element = container[0]
  const path = container[1]

  const mouseEvents = useDividerMouseEvents({
    index,
    element,
    resizeInput,
    onMouseDown:onMouseDown,
    coordinate:mouseCoordinate,
  })

  const keyboardEvents = useDividerKeyboardEvents({
    index,
    element,
    resizeInput,
    onBlur:onBlur,
    onFocus:onFocus,
    coordinate: keyboardCoordinate,
  })

  const touchEvents = useDividerTouchEvents({
    index,
    element,
    resizeInput,
    coordinate: touchCoordinate,
    onTouchStart: onTouchStart
  })

  const classNames = useMemo(function() {
    var e = resizeInput ? "react-page-split__divider--".concat(resizeInput) : ""
    return "react-page-split__divider ".concat(e, " ").concat(className)
  }, [resizeInput, className])
  
  return deepMerge(
    options,
    keyboardEvents,
    mouseEvents,
    touchEvents,
    {
      role,
      ref:path,
      "aria-label":label,
      className: classNames,
    }
  )
}