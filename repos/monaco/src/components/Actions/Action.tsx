import type { TEditorActionExt, TEditorAction } from '../../types'
import { cls } from '@keg-hub/jsutils'
import { isValidElement, cloneElement, createElement, useCallback } from 'react'

export const Action = (props:TEditorAction & TEditorActionExt) => {
  const { 
    name,
    className,
    Component,
    editorRef,
    curPathRef,
    curValueRef,
    onClick:onClickCb,
    ...rest
  } = props

  if(!Component) return null

  const onClick = useCallback((evt:Event) => {
    onClickCb?.(
      evt,
      editorRef.current,
      curPathRef.current,
      curValueRef.current,
    )
  }, [onClickCb])

  const Comp = isValidElement(Component)
      ? cloneElement(Component, { ...rest, onClick } as any)
      : createElement(Component, { ...rest, onClick })

  return (
    <div className={cls(`goblet-monaco-action-main`, className || `goblet-monaco-${name}`)} >
      {Comp}
    </div>
  )
}