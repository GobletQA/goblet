import { isFragment, isForwardRef } from "react-is"
import { useMemo, useCallback, isValidElement } from 'react'

import { clone } from '../utils/clone'
import { extend } from '../utils/extend'
import { usePageSplitDispatch } from './usePageSplitDispatch'

type TWhenElProps = {
  el:any
  ref:any
  styles:any
  children:any
  settings:any
}

const defPanelProps = {
  role: "region"
}

const checkValidEl = (toCheck:any) => {
  if (isValidElement(toCheck))
    return !(typeof toCheck.type == "function")
      && !isFragment(toCheck)
      && !isForwardRef(toCheck)

  return false
}

const whenValidEl = ({
  el,
  ref,
  styles,
  children,
  settings
}:TWhenElProps) => {
  const properties = children.props
  const props = clone(properties, ["className", "style"])

  const className = "react-page-split__panel "
    .concat(el.className ?? "", " ")
    .concat(properties.className ?? "")

  const style = extend(extend({}, properties.style), styles)

  return {
    mergedProps : true,
    panelProps : extend(extend(extend(extend({}, settings), props), defPanelProps), {
      ref,
      className,
      style: style,
    })
  }
}


const whenNotValidEl = ({
  el,
  ref,
  styles,
  children,
  settings
}:TWhenElProps) => {
  const className = "react-page-split__panel ".concat(el.className ?? "")

  return {
    mergedProps : false,
    panelProps : extend(extend(extend({}, settings), defPanelProps), {
      ref,
      children,
      className,
      style: styles,
    })
  }
}

export const usePanel = (el:any) => {
  const {
    size,
    index,
    style,
    children,
    sizeProperty
  } = el

  const settings = clone(el, [
    "index",
    "size",
    "sizeProperty",
    "children",
    "className",
    "style"
  ])

  const callback = usePageSplitDispatch()

  const styles = useMemo(() => {
    let y;
    return !size
      ? style
      : extend(extend({}, style), ((y = {} as any)[sizeProperty] = size, y))
  }, [size, sizeProperty, style])

  const ref = useCallback((mathML:any) => {
    callback({ type : "SetElement", index : index, element : mathML })
  }, [index, callback])

  return checkValidEl(children)
    ? whenValidEl({
        el,
        ref,
        styles,
        children,
        settings
      })
    : whenNotValidEl({
        el,
        ref,
        styles,
        children,
        settings
      })
}
