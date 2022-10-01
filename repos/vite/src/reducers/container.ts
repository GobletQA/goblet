import type { TAction } from '@reducers'
import { deepMerge } from '@keg-hub/jsutils'
import { createDispatcher } from '@utils/dispatcher'
import type { TRouteMeta as TContainerState } from '@types'

export type { TContainerState }

export const containerState = {} as TContainerState

export const containerActions = {
  clear: (state:TContainerState, action:TAction<TContainerState>) => (containerState),
  setContainer: (state:TContainerState, action:TAction<TContainerState>) => action?.payload,
  upsertContainer: (state:TContainerState, action:TAction<TContainerState>) => deepMerge<TContainerState>(state, action?.payload),
}

export const containerDispatch = createDispatcher(containerActions)