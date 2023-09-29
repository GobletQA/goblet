import type { TPlayerResEvent } from '@types'

import { EE } from '@gobletqa/shared/libs/eventEmitter'
import {
  PlayerTestEvt,
  PlayerErrorEvent,
  PlayerEndedEvent,
  PlayerStartedEvent,
  TestsToSocketEvtMap,
} from '@constants'
import { testRunEvents } from '@actions/testRuns/testRunEvents'

/**
 * Emits a PlayerTestEvt event with just the Player test response data
 * If `meta?.fullTestRun` is set, then call testRunEvents instead
 */
export const playEvent = (meta:TPlayerResEvent) => {
  if(meta.fullTestRun)
    return testRunEvents(meta)

  switch(meta.name){
    case TestsToSocketEvtMap.started: {
      return EE.emit(PlayerStartedEvent, meta)
    }
    case TestsToSocketEvtMap.error: {
      return EE.emit(PlayerErrorEvent, meta)
    }
    case TestsToSocketEvtMap.ended: {
      return EE.emit(PlayerEndedEvent, meta)
    }
    default: {
      return EE.emit(PlayerTestEvt, meta)
    }
  }

}