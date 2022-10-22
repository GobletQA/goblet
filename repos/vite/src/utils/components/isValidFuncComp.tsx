import type { ComponentType } from 'react'

import { isValidElement } from 'react'
import { isFunc } from '@keg-hub/jsutils'


export const isValidFuncComp = (Component:any) => {
  return isValidElement(Component) || isFunc<ComponentType<any>>(Component)
}
