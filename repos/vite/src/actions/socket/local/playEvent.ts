import type { TPlayerResEvent } from '@types'

import { terminalDispatch } from '@store'
import { BrowserLogTerminal } from '@constants/types'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { toNum, uuid, omitKeys } from '@keg-hub/jsutils'
import {
  PWPlay,
  PlayerTestEvt,
  PlayerErrorEvent,
  PlayerEndedEvent,
  PlayerStartedEvent,
} from '@constants'


const logOmit = [
  `group`,
  `error`,
  `groupId`,
  `socketId`,
  `isRunning`,
  `isPlaying`,
  `timestamp`,
]

const formatLog = {
  [PWPlay.playStarted]: (meta) => {
    return `Test Started: ${meta?.location}\n`
  },
  [PWPlay.playEnded]: (meta) => {
    return `Test Finished\n\n`
  },
  [PWPlay.playSuiteStart]: (meta, inFeature:string) => {
    const spacer = inFeature ? `   ` : `  `
    return `${spacer}· ${meta.data.description}\n`
  },
  [PWPlay.playSuiteDone]: (meta, inFeature) => {
    const spacer = inFeature ? `   ` : `  `
    return `${spacer}· ${meta.data.description} - ${meta.data.passed ? 'passed' : 'failed'}\n`
  },
  [PWPlay.playSpecStart]: (meta) => {
    return `    · ${meta.data.description}\n`
  },
  [PWPlay.playSpecDone]: (meta) => {
    return `    · ${meta.data.description} - ${meta.data.passed ? 'passed' : 'failed'}\n`
  },
  [PWPlay.playError]: (meta) => {
    return `Test Failed:\n${meta?.message?.split(`\n`).map(line => `   ${line}`).join(`\n`)}\n\n`
  },
} as Record<string, (meta:TPlayerResEvent, ...args:any[]) => string>


let inFeature:string = ``
/**
 * Emits a PlayerTestEvt event with just the Player test response data
 */
export const playEvent = (meta:TPlayerResEvent) => {

  try {
    const formatted = formatLog[meta.name as keyof typeof formatLog]?.(meta, inFeature)
    if(PWPlay.playSuiteStart === meta.name && !inFeature) inFeature = meta.id
    if(inFeature && PWPlay.playSuiteDone === meta.name || PWPlay.playError === meta.name) inFeature = ``

    const { id, name, timestamp } = meta
    const date = new Date(timestamp || Date.now())
    const time = date.toLocaleTimeString(`en-US`)

    // TODO: ADd Terminal Logs setting
    // Allow setting different levels - verbose | pretty | etc...
    // Then show logs based on setting
    const log = formatted || `[${time}] ❯ test-event: ${JSON.stringify(omitKeys(meta, logOmit), null, 2)}\r\n`

    terminalDispatch.appendTerminalHistoryByRef({
      name: BrowserLogTerminal,
      history: {
        message: log,
        id: id || name || uuid(),
        timestamp: toNum(timestamp),
      }
    })
  }
  catch(err:any){
    console.error(err.message)
  }

  switch(meta.name){
    case PWPlay.playStarted: {
      return EE.emit(PlayerStartedEvent, meta)
    }
    case PWPlay.playError: {
      return EE.emit(PlayerErrorEvent, meta)
    }
    case PWPlay.playEnded: {
      return EE.emit(PlayerEndedEvent, meta)
    }
    default: {
      return EE.emit(PlayerTestEvt, meta)
    }
  }

}