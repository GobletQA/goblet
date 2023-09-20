import type { TPlayerResEvent } from '@types'

import { EE } from '@gobletqa/shared/libs/eventEmitter'
import {
  PWPlay,
  PlayerTestEvt,
  PlayerErrorEvent,
  PlayerEndedEvent,
  PlayerStartedEvent,
} from '@constants'
import { examEvent } from '@actions/exam/examEvent'

/**
 * Emits a PlayerTestEvt event with just the Player test response data
 * If `meta?.fullTestRun` is set, then call exam event instead
 */
export const playEvent = (meta:TPlayerResEvent) => {
  if(meta.fullTestRun)
    return examEvent(meta)

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