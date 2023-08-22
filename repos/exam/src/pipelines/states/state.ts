import type { TStateManager } from "@GEX/types"

import {unset} from "@keg-hub/jsutils/unset"
import {deepMerge} from "@keg-hub/jsutils/deepMerge"


export const createState = (initState?:Record<string, any>) => {
  const state = {
    internal: deepMerge({}, initState),
  }

  return {
    getState: () => state.internal,
    addState: (add:Record<string, any>) => {
      state.internal = Object.freeze({...state.internal, ...add})
      return state.internal
    },
    setValue: (key:string, value:any) => {
      state.internal = Object.freeze({...state.internal, [key]: value})
      return state.internal
    },
    delState: (key:string) => {
      const copy = {...state.internal}
      const removed = unset(copy, key)
      state.internal = Object.freeze({...removed})

      state.internal
    },
    cleanup: () => {
      state.internal = undefined
      delete state.internal
    }
  } as TStateManager

}

