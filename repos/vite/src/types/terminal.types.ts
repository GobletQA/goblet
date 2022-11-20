import type { LogLevel } from 'xterm'
import type { MutableRefObject } from 'react'
import type { XTerminal } from '@services/xterm'

export type TTerminalTab = {
  id: string
  name?:string
  history: string[]
}

export type TTerminalTabs = TTerminalTab[]


export type TXTerminal = {
  id: string
  history?:string[]
  element: HTMLElement

  fontSize?: number
  logLevel?: LogLevel
  disableStdin?: boolean
  // Add other terminal options here if needed
}

export type TEventData = {
  key: string,
  domEvent: KeyboardEvent
}

export type TXTermRef = {
  term: XTerminal
  remove?: () => void
  element: MutableRefObject<HTMLDivElement|null>
}

export type TXTermIdMap = {
  [key: string]: TXTermRef
}