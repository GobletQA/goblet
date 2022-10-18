import type { TActionDispatcher, TAnyReducerFuncs } from '@types'
import { getDispatch } from '@store'

export const createDispatcher = <T extends TAnyReducerFuncs>(
  actions: T,
  prefix?: string
): TActionDispatcher<T> => {
  const keys = Object.keys(actions)
  const dispatchActions: Record<string, any> = {}
  for (const key of keys) {
    const dispatcherType = prefix ? `${prefix}/${key}` : key
    dispatchActions[key] = (payload?: any) => {
      const dispatcher = getDispatch()
      dispatcher({
        type: dispatcherType,
        payload,
      })
    }
  }
  return dispatchActions as TActionDispatcher<T>
}