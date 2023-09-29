import type {
  TPlayerResEvent,
  TTestRunExecEvt,
  TTestRunExecEndEvent,
  TTestRunExecErrEvent,
} from '@types'

import {getStore, testRunsDispatch} from "@store"
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { testRunEventFactory } from '@utils/testRuns/testRunEventFactory'
import {
  TestRunErrEvt,
  TestRunExecEvt,
  TestRunExecEndEvt,
  TestsToSocketEvtMap,
} from '@constants'
import {upsertTestRun} from './upsertTestRun'


const onTestEvent = (evt:TPlayerResEvent) => {
  const { app } = getStore().getState()
  const event = testRunEventFactory(evt)
  app.testRunsView
    ? EE.emit<TTestRunExecEvt>(TestRunExecEvt, {
        event,
        runId: evt.runId,
      })
    : testRunsDispatch.addTestRunEvt({
        event,
        runId: evt.runId,
      })
}

const onTestRunError = (evt:TPlayerResEvent) => {
  const { app } = getStore().getState()
  const event = testRunEventFactory(evt)

  app.testRunsView
    ? EE.emit<TTestRunExecErrEvent>(TestRunErrEvt, {
        event,
        runId: event.runId
      })
    : testRunsDispatch.addTestRunEvt({
        event,
        runId: evt.runId,
      })
}

const onTestRunEnd = (event:TPlayerResEvent) => {
  upsertTestRun({ runId: event.runId, data: { finished: true } })
  testRunsDispatch.toggleAllTestsRun(false)

  EE.emit<TTestRunExecEndEvent>(TestRunExecEndEvt, {
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

}