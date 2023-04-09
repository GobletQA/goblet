import type { ComponentType, ReactNode, ReactElement } from 'react'

import { cloneElement } from 'react'
import { emptyObj } from '@keg-hub/jsutils'
import { isReactElement, isValidFuncComp } from '@GBC/utils/components/isValidFuncComp'

export type TIf = {
  if?:any
  cond?:any
  check?:any
  exists?:any
  children?:ReactNode
  props?:Record<any, any>
  Comp?:ComponentType<any>|ReactNode|ReactElement
}

export const If = ({
  if:ifCond,
  cond=ifCond,
  exists:ifExists=cond,
  check=ifExists,
  children,
  Comp=children||check,
  props
}:TIf) => {

  return !check
    ? null
    : !isValidFuncComp(Comp)
      ? Comp as ReactElement
      : isReactElement(Comp)
        ? cloneElement(Comp as ReactElement, props || emptyObj)
        : (<Comp {...props} />) as ReactElement
}
