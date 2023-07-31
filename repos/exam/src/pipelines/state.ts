import {deepMerge, unset, deepFreeze} from "@keg-hub/jsutils"
import {TStateManager} from "./types"


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
    }
  } as TStateManager

}

