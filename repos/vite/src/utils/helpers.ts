import { noOp, isFunc, eitherObj, isBool } from '@keg-hub/jsutils'

/**
 * Converts the passed in method into a callback to allow calling the method in place
 * Second argument can be a boolean or defaults object
 * When boolean, if true, the callback will forward arguments when called, false will not
 * When object, will be passed as the first argument of the callback
 *   * Checks the `allowArgs` property to know if it should forward arguments to the callback
 */
export const asCallback = (callback:(...args:any[]) => any, defs:boolean|Record<any, any>) => {
  if(!isFunc(callback)) return noOp
  
  const defArgs = isBool(defs)
    ? { allowArgs: defs } as Record<any, any>
    : eitherObj(defs, { allowArgs: true }) as Record<any, any>

  return (...args:any[]) => {
    return defArgs.allowArgs ? callback(defs, ...args) : callback()
  }
}