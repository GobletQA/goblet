import type { TPlayerResEvent } from '@types'

import { EE } from '@gobletqa/shared/libs/eventEmitter'
import {
  PWPlay,
  PlayerTestEvt,
  PlayerErrorEvent,
  PlayerEndedEvent,
  PlayerStartedEvent,
} from '@constants'

/**
 * Emits a Exam TestEvt event with just the Exam test response data
 */
export const examEvent = (meta:TPlayerResEvent) => {

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