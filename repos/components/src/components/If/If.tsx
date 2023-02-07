import type { ComponentType, ReactNode } from 'react'
import { isValidFuncComp } from '@GBC/utils/components/isValidFuncComp'

export type TIf = {
  check:any
  children?:ReactNode
  props?:Record<any, any>
  Comp?:ComponentType<any>|ReactNode
}

export const If = ({ children, check, Comp=children||check, props }:TIf) => {
  return check && (isValidFuncComp(Comp) ? (<Comp {...props} />) : Comp) || null
}
