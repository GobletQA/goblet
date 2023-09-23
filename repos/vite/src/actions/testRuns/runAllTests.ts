// TODO: should add a Promise timeout here to avoid memory leaks
// Has to be very long, could be based on the global timeout option from Exam / Parkin

import type {
  TTestRunUICfg,
  TPlayerResEvent,
} from '@types'

import { emptyObj } from '@keg-hub/jsutils'
import { testRunsDispatch } from '@store/dispatchers'
import { WSService } from '@services/socketService'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { PromiseAbort } from '@utils/promise/promiseAbort'
import { SocketMsgTypes } from '@constants'
import {
  TestRunExecEndEvt,
  WSCancelTestRunEvt,
} from '@constants'


export const runAllTests = (testRunOpts:TTestRunUICfg) => {
  let promise = PromiseAbort((res, rej) => {
    // Enable global tests running flag
    testRunsDispatch.toggleAllTestsRun(true)

    WSService.emit(SocketMsgTypes.TESTS_RUN_ALL, { testRunOpts })

    // Then listen for the response event fired from the websocket service
    let onTestRunEnd = EE.on<TPlayerResEvent>(TestRunExecEndEvt, () => res(emptyObj))

    /**
    * Listens for a cancel event
    * When called, cancels the promise and cleans up the automation
    * Calls clean up events on both backend and frontend
    *
    */
    const cancelOff = EE.on(
      WSCancelTestRunEvt,
      () => {
        onTestRunEnd?.()
        onTestRunEnd = undefined
        // Send event to cancel on the backend
        WSService.emit(SocketMsgTypes.TESTS_RUN_ABORT)
        
        // Finally stop listening, cancel and reject
        cancelOff?.()
        promise.cancel()
        // @ts-ignore
        promise = undefined
        rej(emptyObj)
      }
    )
  })
}