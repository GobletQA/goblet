import type { ComponentType, ReactNode } from 'react'
import { isValidFuncComp } from '@GBC/utils/components/isValidFuncComp'
import { exists } from '@keg-hub/jsutils'

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
  return check
    && (isValidFuncComp(Comp) ? (<Comp {...props} />) : Comp)
    || null
}
