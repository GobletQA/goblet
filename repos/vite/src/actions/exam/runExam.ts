import type {
  TGitData,
  TFileModel,
  TStartPlaying,
  TPlayerResEvent,
  TStartBrowserPlayOpts
} from '@types'


import { addToast } from '@actions/toasts'
import { emptyObj } from '@keg-hub/jsutils'
import { appDispatch } from '@store/dispatchers'
import { WSService } from '@services/socketService'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { PromiseAbort } from '@utils/promise/promiseAbort'
import { SocketMsgTypes, WSRecordActions } from '@constants'
import {
  ExamEndedEvent,
  WSCancelExamEvent,
} from '@constants'


export const runExam = () => {

  let promise = PromiseAbort((res, rej) => {

    // Enable global exam running flag
    appDispatch.toggleExamRunning(true)

    WSService.emit(SocketMsgTypes.EXAM_RUN, {
      examOpts: {
        // TODO: pass in the exam options from UI
        // tags: [`@whitelist`]
      }
    })

    // Then listen for the response event fired from the websocket service
    let onExamEnd = EE.on<TPlayerResEvent>(ExamEndedEvent, () => res(emptyObj))

    /**
    * Listens for a cancel event
    * When called, cancels the promise and cleans up the automation
    * Calls clean up events on both backend and frontend
    *
    */
    const cancelOff = EE.on(
      WSCancelExamEvent,
      () => {
        onExamEnd?.()
        onExamEnd = undefined
        // Send event to cancel on the backend
        WSService.emit(SocketMsgTypes.EXAM_ABORT)

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