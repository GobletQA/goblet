import type { LogLevel, ITheme } from 'xterm'
import type { MutableRefObject } from 'react'
import type { XTerminal } from '@services/xterm'
import type { EThemeType } from './theme.types'

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

  theme?: ITheme
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
  themeMode: EThemeType
  element: MutableRefObject<HTMLDivElement|null>
}

export type TXTermIdMap = {
  [key: string]: TXTermRef
}