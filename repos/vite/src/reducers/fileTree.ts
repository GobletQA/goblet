import type { TAction } from '@reducers'
import type { TFileTree as TFileTreeState } from '@types'

export type { TFileTreeState }

export const fileTreeState = {} as TFileTreeState

export const fileTreeActions = {
  clear: (state:TFileTreeState, action:TAction<TFileTreeState>) => (fileTreeState),
  setFileTree: (
    state:TFileTreeState,
    action:TAction<TFileTreeState>
  ) => {
    return {
      ...state,
      ...action?.payload,
    }
  },
}
