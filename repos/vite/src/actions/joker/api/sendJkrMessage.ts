import { TJokerMessage } from "@types";
import { WSService } from '@services/socketService'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { PromiseAbort } from '@utils/promise/promiseAbort'
import {jokerDispatch} from "@store"
import { SocketMsgTypes } from '@constants'


export const sendJkrMessage = (props:TJokerMessage) => {
  let promise = PromiseAbort((res, rej) => {

    // Enable global tests running flag
    jokerDispatch.toggleJokerRunning(true)

    WSService.emit(SocketMsgTypes.JOKER_SEND_MESSAGE, props)

    // Then listen for the response event fired from the websocket service
    // let onJokerResp = EE.on<TPlayerResEvent>(TestRunExecEndEvt, () => res(emptyObj))

    /**
    * Listens for a cancel event
    * When called, cancels the promise and cleans up the automation
    * Calls clean up events on both backend and frontend
    *
    */
    // const cancelOff = EE.on(
    //   WSCancelTestRunEvt,
    //   () => {
    //     testRunsDispatch.cancelTestRun()
    //     testRunsDispatch.toggleAllTestsRun(false)

    //     // Send event to cancel locally
    //     EE.emit(TestRunExecCancelEvt)

    //     // Send event to cancel on the backend
    //     WSService.emit(SocketMsgTypes.TESTS_RUN_ABORT)

    //     // Finally stop listening, cancel and reject
    //     cancelOff?.()
    //     promise.cancel()

    //     // @ts-ignore
    //     promise = undefined

    //     onTestRunEnd?.()
    //     onTestRunEnd = undefined
    //     rej(emptyObj)
    //   }
    // )

  })

}