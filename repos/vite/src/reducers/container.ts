import type { TDspAction, TContainerMeta, TProxyRoute } from '@types'

import { deepMerge } from '@keg-hub/jsutils'


export type TContainerState = {
  api: TProxyRoute
  meta: TContainerMeta
  screencast: TProxyRoute
}

export const containerState = {} as TContainerState

export const containerActions = {
  clearContainer: (state:TContainerState, action:TDspAction<TContainerState>) => (containerState),
  setContainer: (state:TContainerState, action:TDspAction<TContainerState>) => action?.payload,
  upsertContainer: (state:TContainerState, action:TDspAction<TContainerState>) => deepMerge<TContainerState>(state, action?.payload),
}
