import type { TAction, TContainerMeta, TProxyRoute } from '@types'

import { deepMerge } from '@keg-hub/jsutils'


export type TContainerState = {
  api: TProxyRoute
  meta: TContainerMeta
  screencast: TProxyRoute
}

export const containerState = {} as TContainerState

export const containerActions = {
  clear: (state:TContainerState, action:TAction<TContainerState>) => (containerState),
  setContainer: (state:TContainerState, action:TAction<TContainerState>) => action?.payload,
  upsertContainer: (state:TContainerState, action:TAction<TContainerState>) => deepMerge<TContainerState>(state, action?.payload),
}
