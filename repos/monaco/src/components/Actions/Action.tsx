import type { TEditorAction } from '../../types'
import { cls } from '@keg-hub/jsutils'
import { isValidElement, cloneElement, createElement } from 'react'

export const Action = (props:TEditorAction) => {
  const { Component, className, name, ...rest } = props
  if(!Component) return null

  const Comp = isValidElement(Component)
      ? cloneElement(Component, rest)
      : createElement(Component, rest)

  return (
    <div className={cls('goblet-monaco-action-main', className || `goblet-monaco-${name}`)} >
      {Comp}
    </div>
  )
}