import type { TStepCtx } from '@GTU/Types'

// import { getPage, getContext } from '@GTU/Playwright'
import { getParkinInstance } from './instance'
import { wait } from '@keg-hub/jsutils/wait'
import { isFunc } from '@keg-hub/jsutils/isFunc'

const augmentCtx = async (ctx:TStepCtx) => {
  if(!ctx) return ctx

  const goblet = global.__goblet
  return {...ctx, goblet }

  // No sure if we should inject the page and context into the step ctx object
  // Could cause memory leaks and other issues
  // const context = getContext()
  // const page = await getPage()
  // return {...ctx, goblet, page, context }
}


/**
 * Still debating on if this is a good idea or not.
 * It wraps the step method with a 1 second buffer before and after
 * May help will web inconsistencies.
 */
const waitBuffer = false

const getStepHandler = (name:string) => {
  return (...args:any[]) => {
    const PK = getParkinInstance()
    const [match, action, meta] = args

    const method = !isFunc(action)
      ? action
      : async (...args:any[]) => {
          waitBuffer && await wait(1000)
          const ctx = args.pop() as TStepCtx
          const augmented = await augmentCtx(ctx)

          const resp = await action(...args, augmented)
          waitBuffer && await wait(1000)

          return resp
        }

    return PK[name].apply(PK, [match, method, meta])
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
