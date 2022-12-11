import type { ComponentType, ElementType } from 'react'

import { isValidElement } from 'react'
import { isFunc } from '@keg-hub/jsutils'


export const isValidFuncComp = (Component:any): Component is ElementType<any> => {
  return !isValidElement<any>(Component) && isFunc<ComponentType<any>>(Component)
}
