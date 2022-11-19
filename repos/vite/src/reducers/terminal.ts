import type { TAction, TTerminalTabs, TTerminalTab } from '@types'

import { isStr, isNum, uuid, ensureArr } from '@keg-hub/jsutils'

export type TTerminalState = {
  tabs: TTerminalTabs
  active: number
}

const buildTab = (name:string) => ({
  name,
  id: uuid(),
  history: [],
})

export const terminalState = {
  active: 0,
  tabs: [buildTab(`terminal-0`)],
} as TTerminalState


export const terminalActions = {
  clear: (state:TTerminalState, action:TAction<any>) => ({
    active: 0,
    tabs: [{ id: uuid(), history: [] }],
  }),
  setActive: (state:TTerminalState, action:TAction<number>) => ({
    ...state,
    active: action.payload
  }),
  appendHistory: (state:TTerminalState, action:TAction<string|string[]>) => {
    const tab = state.tabs[state.active]
    if(!tab) return state

    state.tabs[state.active] = {
      ...tab,
      history: [...tab.history, ...ensureArr(action.payload)]
    }
  },
  create: (state:TTerminalState, action:TAction<Partial<TTerminalTab>>) => {
    const newTab = buildTab(`terminal-${state.tabs.length}`)
    return {
      ...state,
      active: state.tabs.length,
      tabs: [ ...state.tabs, newTab]
    }
  },
  add: (state:TTerminalState, action:TAction<TTerminalTab>) => {
    return {
      ...state,
      tabs: [ ...state.tabs, action.payload ]
    }
  },
  remove: (state:TTerminalState, action:TAction<TTerminalTab|string|number>) => {
    const { payload } = action
    const id = isStr(payload)
      ? payload
      : isNum(payload)
        ? state.tabs[payload]?.id
        : payload?.id

    const activeTab = state.tabs[state.active]
    const filtered = state.tabs.filter((tab, idx) => {
      if(tab.id !== id) return true
      return false
    })
    const activeIdx = filtered.indexOf(activeTab)

    return !id
      ? state
      : {
          ...state,
          active: activeIdx >= 0 ? activeIdx : 0,
          tabs: filtered.length ? filtered : [buildTab(`terminal-0`)],
        }
  },
}
