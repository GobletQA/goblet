import type { TPlayerResEvent } from '@types'

import { toNum, uuid } from '@keg-hub/jsutils'
import { terminalDispatch } from '@store'
import { BrowserLogTerminal } from '@constants/types'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import {
  PWPlay,
  PlayerTestEvt,
  PlayerErrorEvent,
  PlayerEndedEvent,
  PlayerStartedEvent,
} from '@constants'

/**
 * Emits a PlayerTestEvt event with just the Player test response data
 */
export const playEvent = (meta:TPlayerResEvent) => {

  const { id, name, timestamp } = meta
  const date = new Date(timestamp || Date.now())
  const time = date.toLocaleTimeString(`en-US`)
  const log = `[${time}] ❯ test-event: ${JSON.stringify(meta, null, 2)}\r\n`

  // TODO:
  // Only first log seems to be working
  // After that, other logs don't show up in the terminal?
  terminalDispatch.appendTerminalHistoryByRef({
    name: BrowserLogTerminal,
    history: {
      message: log,
      id: id || name || uuid(),
      timestamp: toNum(timestamp),
    }
  })

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