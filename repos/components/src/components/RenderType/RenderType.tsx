import type { ComponentType, ReactNode, ComponentProps } from 'react'
import { isValidFuncComp } from '@GBC/utils/components/isValidFuncComp'

export type TRenderType = {
  props?:ComponentProps<any>
  Component: ComponentType<any>|ReactNode
}

export const RenderType = ({ Component, props }:TRenderType) => {
  return (
    <>
      { isValidFuncComp(Component) ? (<Component {...props} />) : {Component} }
    </>
  )
  
}