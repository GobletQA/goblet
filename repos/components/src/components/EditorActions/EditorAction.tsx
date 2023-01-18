import type { TEditorAction } from '../../types'
import type { MutableRefObject } from 'react'

import { cls } from '@keg-hub/jsutils'
import { ActionItem } from './EditorActions.styled'
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
>(props:TEditorAction<TEditor, TEditorRef>) => {
  const {
    name,
    id=name,
    curPath,
    Component,
    editorRef,
    curValueRef,
    onClick:onClickCb,
    className=`goblet-editor-${id}`,
  } = props

  const onClick = useCallback((evt:Event) => {
    onClickCb?.(
      evt,
      editorRef.current,
      curPath,
      curValueRef.current,
    )
  }, [curPath, onClickCb])

  return useMemo(() => {
    const compProps = {
      id,
      name,
      onClick,
      className,
      activeFile: curPath,
    }

    return isValidElement(Component)
      ? cloneElement(Component, compProps as any)
      : createElement(Component, compProps)
  }, [
    id,
    name,
    curPath,
    onClick,
    className,
    Component,
  ])

}

export const EditorAction = <
  TEditor=any,
  TEditorRef extends MutableRefObject<any>=MutableRefObject<any>
>(props:TEditorAction<TEditor, TEditorRef>) => {
  if(!props.Component) return null

  const { id, name, className } = props
  const Comp = useActionComp(props)

  return (
    <ActionItem className={cls(`goblet-editor-action-main`, className || `goblet-editor-${id || name}`)} >
      {Comp}
    </ActionItem>
  )
}