import type { TAddTestRunEvts, TPlayerResEvent } from '@types'

// import { PWPlay } from '@constants'
import {testRunsDispatch} from "@store"
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { testRunEventFactory } from '@utils/testRuns/testRunEventFactory'

// const { playStarted } = PWPlay

/**
 * Emits a Exam TestEvt event with just the Exam test response data
 */
export const testRunEvents = (evt:TPlayerResEvent) => {
  const event = testRunEventFactory(evt)

  testRunsDispatch.addEvtAndMakeActive({ runId: evt.runId, event })


  // switch(meta.name){
  //   case PWPlay.playStarted: {
  //     return EE.emit(PlayerStartedEvent, meta)
  //   }
  //   case PWPlay.playError: {
  //     return EE.emit(PlayerErrorEvent, meta)
  //   }
  //   case PWPlay.playEnded: {
  //     return EE.emit(PlayerEndedEvent, meta)
  //   }
  //   default: {
  //     return EE.emit(PlayerTestEvt, meta)
  //   }
  // }

}