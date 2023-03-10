// @ts-nocheck
import type { ComponentType, ReactNode } from 'react'
import { isValidFuncComp, isForwardRefComp } from '@GBC/utils/components/isValidFuncComp'
import { exists, isObj, emptyObj } from '@keg-hub/jsutils'

export type TIf = {
  if?:any
  cond?:any
  check?:any
  exists?:any
  children?:ReactNode
  props?:Record<any, any>
  Comp?:ComponentType<any>|ReactNode
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
      ? Comp
      : isForwardRefComp(Comp) && Comp?.type?.render
        ? Comp?.type?.render?.(props || emptyObj, props?.ref)
        : (<Comp {...props} />)
}
