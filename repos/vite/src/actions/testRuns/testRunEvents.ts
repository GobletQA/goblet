import type {
  TPlayerResEvent,
  TTestRunExecEvt,
  TTestRunExecEndEvent,
  TTestRunExecErrEvent,
} from '@types'

import {testRunsDispatch} from "@store"
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { testRunEventFactory } from '@utils/testRuns/testRunEventFactory'
import {
  TestRunErrEvt,
  TestRunExecEvt,
  TestRunExecEndEvt,
  TestsToSocketEvtMap,
} from '@constants'


const onTestEvent = (evt:TPlayerResEvent) => {
  const event = testRunEventFactory(evt)
  EE.emit<TTestRunExecEvt>(TestRunExecEvt, {
    event,
    runId: evt.runId,
  })
}

const onTestRunEnd = (event:TPlayerResEvent) => {
  testRunsDispatch.toggleAllTestsRun(false)
  EE.emit<TTestRunExecEndEvent>(TestRunExecEndEvt, {
    event,
    runId: event.runId,
  })
}

const onTestRunError = (evt:TPlayerResEvent) => {
  const event = testRunEventFactory(evt)
  EE.emit<TTestRunExecErrEvent>(TestRunErrEvt, {
    event,
    runId: event.runId,
  })
}

/**
 * Emits a Test Run TestEvt event with just the test run response data
 */
export const testRunEvents = (evt:TPlayerResEvent) => {

  switch(evt.name){
    case TestsToSocketEvtMap.ended: {
      return onTestRunEnd(evt)
    }
    case TestsToSocketEvtMap.error: {
      return onTestRunError(evt)
    }
    default: {
      return onTestEvent(evt)
    }
  }

  /**
   * TODO: Redux is to slow to capture all the event updates
   * It would be nice if we could update the store directly
   * As we could just call it here.
   * But need to find a work-around to update the store without re-rendering the UI
   */
  // testRunsDispatch.addEvtAndMakeActive({ runId: evt.runId, event })

}