import type { TAction, TTerminalTabs, TTerminalTab, TTerminalLog } from '@types'

import { BrowserLogTerminal } from '@constants'
import { randomName } from '@services/randomName'
import { isStr, isNum, uuid, ensureArr } from '@keg-hub/jsutils'

export type TTerminalState = {
  tabs: TTerminalTabs
  active: number
}

export type THistoryPayload = {
  id?:string,
  name?: string,
  history:TTerminalLog|TTerminalLog[]
}

const buildTab = (tab?:Partial<TTerminalTab>) => ({
  id: uuid(),
  history: [],
  disabled: false,
  name: randomName(),
  ...tab,
})

export const terminalState = {
  active: 0,
  tabs: [buildTab({ name: BrowserLogTerminal, disabled: true })],
} as TTerminalState


export const terminalActions = {
  clearTerminal: (state:TTerminalState, action:TAction<any>) => {
    const tab = Object.values(state.tabs).find(tab => tab.name === BrowserLogTerminal)
      || buildTab({ name: BrowserLogTerminal, disabled: true })

    return {
      active: 0,
      tabs: [tab],
    }
  },
  setActiveTerminal: (
    state:TTerminalState,
    action:TAction<number>
  ) => ({
    ...state,
    active: action.payload
  }),
  appendTerminalHistory: (
    state:TTerminalState,
    action:TAction<TTerminalLog|TTerminalLog[]>
  ) => {
    const tab = state.tabs[state.active]
    if(!tab) return state

    state.tabs[state.active] = {
      ...tab,
      history: [...tab.history, ...ensureArr(action.payload)]
    }
  },
  appendTerminalHistoryByRef: (
    state:TTerminalState,
    action:TAction<THistoryPayload>
  ) => {
    const { name, id, history } = action.payload
    const tab = Object.values(state.tabs).find(tab => tab.name === name || tab.id === id)
    if(!tab) return state

    state.tabs[state.tabs.indexOf(tab)] = {
      ...tab,
      history: [...tab.history, ...ensureArr(history)]
    }
  },
  createTerminal: (
    state:TTerminalState,
    action:TAction<Partial<TTerminalTab>>
  ) => {
    return {
      ...state,
      active: state.tabs.length,
      tabs: [ ...state.tabs, buildTab(action.payload)]
    }
  },
  addTerminal: (state:TTerminalState, action:TAction<TTerminalTab>) => {
    return {
      ...state,
      tabs: [ ...state.tabs, buildTab(action.payload) ]
    }
  },
  removeTerminal: (state:TTerminalState, action:TAction<TTerminalTab|string|number>) => {
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
          tabs: filtered.length ? filtered : [buildTab({ name: BrowserLogTerminal, disabled: true })],
        }
  },
}
