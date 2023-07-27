import type { Context } from 'vm'

import { createContext } from 'vm'
import { emptyObj } from '@keg-hub/jsutils'

const ModGlobalScopeItems = [
  `module`,
  `require`,
  `exports`,
  `__dirname`,
  `__filename`
]


/**
 * Helper script to loop through all properties on an object
 */
const loopPropKeys = (
  context:Context,
  cb:(key: string|symbol) => void
):void => {
  Object.getOwnPropertyNames(context).forEach(cb)
  Object.getOwnPropertySymbols(context).forEach(cb)
}

/**
 * Helper script to add a property to an object
 */
const defineProp = (
  to:Context,
  from:Context,
  key:string|symbol,
  ext:Record<any, any>=emptyObj
) => {
  Object.defineProperty(to, key, {
    ...Object.getOwnPropertyDescriptor(from, key),
    ...ext,
  })
}

/**
 * Adds the passed in globals to the context from the current global scope
 */
const addGlobals = (
  gCtx:Context,
  overrides:Context={}
) => {
  loopPropKeys(overrides, key => {
    !(key in global)
      ? defineProp(gCtx, overrides, key)
      : defineProp(gCtx, global, key, {value: overrides[key as keyof Context]})
  })

  return gCtx
}

/**
 * Merges the properties from one object into another
 * Used for merging the global context from one VM context to another
 */
export const mergeCtxs = (
  source: Context,
  target: Context
):Context => {
  loopPropKeys(source, key => {
    Object.defineProperty(target, key, {
      ...Object.getOwnPropertyDescriptor(source, key)
    })
  })

  return target
}

/**
 * Creates the main global context thats reused for running all scripts
 */
const ctxFromGlobal = ():Context => {
  // Merges the current global context with the new global context
  // We will want to update this at some point
  const merged = mergeCtxs(global, {})

  // Remove refs to the current global
  // The new global will be recreated
  delete merged.global
  delete merged.globalThis

  return merged
}


export const createGCtx = (globals: Context):Context => {
  const gCtx = addGlobals(ctxFromGlobal(), globals)

  return createContext(gCtx)
}

export const resetGCtx = (
  gCtx:Context,
  mCtx:Context,
) => {
  const updateCtx = mergeCtxs(mCtx, gCtx)
  ModGlobalScopeItems.forEach(item => {
    updateCtx[item] = undefined
    delete updateCtx[item]
  })
  updateCtx.global = updateCtx
  updateCtx.globalThis = updateCtx

  return updateCtx
}
