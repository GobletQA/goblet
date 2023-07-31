import type { TStepCtx, TLocator } from '@GTU/Types'

import {getStepTimeout} from '@GTU/Support'
import {isBool, isObj } from '@keg-hub/jsutils'
import { getPage } from '@GTU/Playwright/browserContext'


type TWaitFor = {
  timeout:number
  state:`visible` | `attached` | `detached` | `hidden`
}

/**
 * TODO: figure out how to set global timeout from the browser or cli
 * The pull it in here and use it to set the config of the waitFor
 */
const getLocationWaitOpts = (ctx?:TStepCtx, waitFor?:TWaitFor|boolean):TWaitFor|undefined => {
  // process.env.EXAM_ENV
  const defWaitOpts = {
    state: `visible`,
    timeout: getStepTimeout(ctx),
  }

  // waitFor must be explicitly set to false to skip waitFor options
  return waitFor === false
    ? undefined
    : typeof waitFor === `object`
      ? { ...defWaitOpts, ...waitFor } as TWaitFor
      : defWaitOpts as TWaitFor
}

type TWaitArg = TStepCtx|TWaitFor|boolean

const getWaitArgs = (arg1:TWaitArg, arg2:TWaitArg) => {
  if(isBool(arg1)) return [arg2, arg1] as [TStepCtx, boolean]

  if(isBool(arg2)) return [arg1, arg2] as [TStepCtx, boolean]

  if(isObj(arg1) && `world` in arg1) return [arg1, arg2] as [TStepCtx, TWaitFor|boolean]

  if(isObj(arg2) && `world` in arg2) return [arg2, arg1] as [TStepCtx, TWaitFor|boolean]

  return [undefined, arg1] as [undefined, TWaitFor|boolean]
}

/**
 * Finds an element on the current page as a locator
 * @param {string} selector
 * @return <Locator?> - the Playwright.Locator object found with `selector`, or null if it does not exist
 */
export const getLocator = async (
  selector:string,
  arg1?:TWaitArg, // <--- Should be step ctx object
  arg2?:TWaitArg, // <--- Should be custom waitFor opts
) => {

  const [ctx, waitFor] = getWaitArgs(arg1, arg2)
  
  const page = await getPage()
  // TODO: allow first to be configurable
  // Should be set in the same way the timeout options are set
  // Need to figure out how to set those, maybe a global, but not a great solution
  const locator = page.locator(selector).first()
  if (!locator) throw new Error(`The element with selector "${selector}" could not be found.`)

  const opts = getLocationWaitOpts(ctx, waitFor)
  opts && await locator.waitFor(opts)

  return locator as TLocator
}
