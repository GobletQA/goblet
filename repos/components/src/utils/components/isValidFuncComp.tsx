import type { ComponentType, ElementType } from 'react'

import { isValidElement } from 'react'
import { isObj, isFunc } from '@keg-hub/jsutils'


/**
 * Validates if the passed in Component is a render-able react function or class component
 */
export const isValidFuncComp = (Component:any): Component is ElementType<any> => {
  return (!isValidElement<any>(Component) && isFunc<ComponentType<any>>(Component))
    || (isObj(Component) && (`render` in Component) && (`$$typeof` in Component))
    || (isObj(Component) && (`type` in Component) && (`render` in Component.type) && (`$$typeof` in Component.type))
}

/**
 * Validates if the passed in Component is wrapped in React.forwardRef
 */
export const isForwardRefComp = (Component:any) => {
  return Component?.$$typeof?.toString?.() === `Symbol(react.element)`
}


/**
 * Validates if the passed in Component is a render-able react function or class component
 */
export const isComponent = <T=any>(Component:any): Component is ElementType<T> => {
  return typeof Component === `function`
    && (String(Component).includes('return React.createElement') || !!Component.prototype.isReactComponent)
}