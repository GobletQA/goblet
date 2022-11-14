import { clone } from '../utils/clone'
import { extend } from '../utils/extend'
import { useDivider } from './useDivider'
import {
  HorizontalTouchCoordinate,
  HorizontalMouseCoordinate,
  HorizontalKeyboardCoordinate,
} from '../utils/coordinates/horizontal'

export const useHorizontalDivider = (params:any) => {

  const className = !params.className ? "" : params.className

  const mouseCoordinate = !params.mouseCoordinate
    ? HorizontalMouseCoordinate
    : params.mouseCoordinate

  const touchCoordinate = !params.touchCoordinate
    ? HorizontalTouchCoordinate
    : params.touchCoordinate

  const keyboardCoordinate = !params.keyboardCoordinate
    ? HorizontalKeyboardCoordinate
    : params.keyboardCoordinate
  
  const data = clone(params, [
    "className",
    "mouseCoordinate",
    "keyboardCoordinate",
    "touchCoordinate",
  ])

  return useDivider(extend({
    mouseCoordinate,
    touchCoordinate,
    keyboardCoordinate,
    "aria-orientation" : "vertical",
    "aria-label" : "Resize horizontally",
    className : "react-page-split__divider--horizontal ".concat(className),
  }, data))
}