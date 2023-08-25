import { getParkinInstance } from './instance'
import { wait } from '@keg-hub/jsutils/wait'

const getStepHandler = (name:string) => {
  return async (...args:any[]) => {
    const parkin = getParkinInstance()

    await wait(1000)
    const resp = parkin[name].apply(parkin, args)
    await wait(1000)

    return resp
  }
}

/**
 * Step functions wrapped to allow calling the methods from the correct parkin instance
 * This allows us to use the correct parkin instance at the time the method is called
 * @example
 * import { Given } from '@GTU/Parkin'
 * Given('<some matcher>', () => doSomething(p))
 */
export const Given = getStepHandler('Given')
export const When = getStepHandler('When')
export const Then = getStepHandler('Then')
export const And = getStepHandler('And')
export const But = getStepHandler('But')
