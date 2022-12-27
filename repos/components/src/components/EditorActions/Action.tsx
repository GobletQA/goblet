import type { TAction } from '../../types'
import type { MutableRefObject } from 'react'

import { cls } from '@keg-hub/jsutils'
import { ActionItem } from './Actions.styled'
import {
  useMemo,
  useCallback,
  cloneElement,
  createElement,
  isValidElement,
} from 'react'




const useActionComp = <
  TEditor=Record<any, any>,
  TEditorRef extends MutableRefObject<any>=MutableRefObject<any>
>(props:TAction<TEditor, TEditorRef>) => {
  const {
    name,
    id=name,
    Component,
    editorRef,
    curPathRef,
    curValueRef,
    onClick:onClickCb,
    className=`goblet-editor-${id}`,
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

export const Action = <
  TEditor=any,
  TEditorRef extends MutableRefObject<any>=MutableRefObject<any>
>(props:TAction<TEditor, TEditorRef>) => {
  if(!props.Component) return null

  const { id, name, className } = props
  const Comp = useActionComp(props)

  return (
    <ActionItem className={cls(`goblet-editor-action-main`, className || `goblet-editor-${id || name}`)} >
      {Comp}
    </ActionItem>
  )
}