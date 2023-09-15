import type {
  TGitData,
  TFileModel,
  TStartPlaying,
  TPlayerResEvent,
  TStartBrowserPlayOpts
} from '@types'


import { addToast } from '@actions/toasts'
import { WSService } from '@services/socketService'
import { pickKeys, emptyObj } from '@keg-hub/jsutils'
import { getWorldVal } from '@utils/repo/getWorldVal'
import { getRepoData } from '@utils/store/getStoreData'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { PromiseAbort } from '@utils/promise/promiseAbort'
import { SocketMsgTypes, WSRecordActions } from '@constants'
import { buildCmdParams } from '@utils/browser/buildCmdParams'
import {
  ExamEndedEvent,
  ExamErrorEvent,
  WSCancelExamEvent,
} from '@constants'


export const runExam = () => {

  let promise = PromiseAbort((res, rej) => {
    WSService.emit(SocketMsgTypes.EXAM_RUN, {})

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
        WSService.emit(SocketMsgTypes.EXAM_ABORT, { player: true })

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