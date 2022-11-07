import type { TAction } from '@types'
import type { TFileTree as TFileTreeState, TFileTreeNode } from '@types'

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
  setNodes: (
    state:TFileTreeState,
    action:TAction<Record<string, TFileTreeNode>>
  ) => {
    return {
      ...state,
      nodes: {
        ...state.nodes,
        ...action?.payload,
      }
    }
  },
  setNode: (
    state:TFileTreeState,
    action:TAction<TFileTreeNode>
  ) => {
    state.nodes[action.payload.id] = action.payload
  },
  removeNode: (
    state:TFileTreeState,
    action:TAction<string>
  ) => {
    if(state.nodes[action.payload])
      delete state.nodes[action.payload]
  },
  upsertNode: (
    state:TFileTreeState,
    action:TAction<TFileTreeNode>
  ) => {
    state.nodes[action.payload.id] = {
      ...state.nodes[action.payload.id],
      ...action.payload,
    }
  },
}
