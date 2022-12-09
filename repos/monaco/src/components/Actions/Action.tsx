import type { TEditorActionExt, TEditorAction } from '../../types'
import { cls } from '@keg-hub/jsutils'
import {
  useMemo,
  useCallback,
  cloneElement,
  createElement,
  isValidElement,
} from 'react'

const useActionComp = (props:TEditorAction & TEditorActionExt) => {
  const {
    name,
    id=name,
    Component,
    editorRef,
    curPathRef,
    curValueRef,
    onClick:onClickCb,
    className=`goblet-monaco-${id}`,
  } = props

  const onClick = useCallback((evt:Event) => {
    onClickCb?.(
      evt,
      editorRef.current,
      curPathRef.current,
      curValueRef.current,
    )
  }, [onClickCb])

  return useMemo(() => {
    const compProps = {
      id,
      name,
      onClick,
      className,
      activeFile: curPathRef.current,
    }

    return isValidElement(Component)
      ? cloneElement(Component, compProps as any)
      : createElement(Component, compProps)
  }, [
    id,
    name,
    onClick,
    className,
    Component,
    curPathRef.current,
  ])

}

export const Action = (props:TEditorAction & TEditorActionExt) => {
  if(!props.Component) return null

  const { id, name, className } = props
  const Comp = useActionComp(props)

  return (
    <div className={cls(`goblet-monaco-action-main`, className || `goblet-monaco-${id || name}`)} >
      {Comp}
    </div>
  )
}