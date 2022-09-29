import type { ActionDispatcher, AnyReducerFuncs, ReduxAction } from '@types'
import { getDispatch } from '@store'

export const createDispatcher = <T extends AnyReducerFuncs>(
  actions: T,
  prefix?: string
): ActionDispatcher<T> => {
  const keys = Object.keys(actions)
  const dispatcher = getDispatch()
  const dispatchActions: Record<string, any> = {}
  for (const key of keys) {
    const dispatcherType = prefix ? `${prefix}/${key}` : key
    dispatchActions[key] = (payload?: any) => {
      dispatcher({
        type: dispatcherType,
        payload,
      })
    }
  }
  return dispatchActions as ActionDispatcher<T>
}