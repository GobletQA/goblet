import type { TOnTestRunEvent, TAddTestRunEvts, TPlayerResEvent } from '@types'

import { PWPlay } from '@constants'
import {testRunsDispatch, getStore} from "@store"
import { OnTestRunEvt } from '@constants'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { testRunEventFactory } from '@utils/testRuns/testRunEventFactory'
import { appDispatch } from '@store'

// const { playStarted } = PWPlay

/**
 * Emits a Exam TestEvt event with just the Exam test response data
 */
export const testRunEvents = (evt:TPlayerResEvent) => {

  if(evt.name !== PWPlay.playResults){
    const { app } = getStore().getState()
    !app.allTestsRunning && appDispatch.toggleAllTestsRun(true)
  }

  const event = testRunEventFactory(evt)
  
  EE.emit<TOnTestRunEvent>(OnTestRunEvt, { runId: evt.runId, event })

  // TODO: fix this hack, need an on all tests finished event from backend websocket
  evt.name === PWPlay.playResults
    && appDispatch.toggleAllTestsRun(false)


  // testRunsDispatch.addEvtAndMakeActive({ runId: evt.runId, event })

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