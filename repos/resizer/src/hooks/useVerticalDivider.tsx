import { clone } from '../utils/clone'
import { extend } from '../utils/extend'
import { useDivider } from './useDivider'
import {
  VerticalTouchCoordinate,
  VerticalMouseCoordinate,
  VerticalKeyboardCoordinate,
} from '../utils/coordinates/vertical'

export const useVerticalDivider = (node:any) => {
  const className = !node.className ? "" : node.className

  const mouseCoordinate = !node.mouseCoordinate
    ? VerticalMouseCoordinate
    : node.mouseCoordinate

  const keyboardCoordinate = !node.keyboardCoordinate
    ? VerticalKeyboardCoordinate
    : node.keyboardCoordinate

  const touchCoordinate = !node.touchCoordinate
    ? VerticalTouchCoordinate
    : node.touchCoordinate

  const props = clone(node, [
    "className",
    "mouseCoordinate",
    "keyboardCoordinate",
    "touchCoordinate"
  ])

  return useDivider(extend({
    mouseCoordinate,
    touchCoordinate,
    keyboardCoordinate,
    "aria-orientation" : "horizontal",
    "aria-label" : "Resize vertically",
    className : "react-page-split__divider--vertical ".concat(className),
  }, props))
}