import type { TJokerReq, TJokerSocketRes } from "@types"


import {jokerDispatch} from "@store"
import { EJokerMessageType } from "@types"
import { emptyObj } from "@keg-hub/jsutils"
import { WSService } from '@services/socketService'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { PromiseAbort } from '@utils/promise/promiseAbort'
import {
  SocketMsgTypes,
  CancelJokerReqEvt,
  WSCancelJokerReqEvt,
} from '@constants'


export const jokerRequest = (props:TJokerReq) => {
  const { cb, ...rest } = props
  
  let promise = PromiseAbort((res, rej) => {

    // Enable global tests running flag
    jokerDispatch.toggleJokerRunning(true)
    jokerDispatch.upsertJkrMessage({...rest, type: EJokerMessageType.User})

    WSService.emit(SocketMsgTypes.JOKER_REQUEST, rest)

    // Then listen for the response event fired from the websocket service
    let onJokerRespOff = EE.on<TJokerSocketRes>(
      SocketMsgTypes.JOKER_RESPONSE,
      (resp=emptyObj as TJokerSocketRes) => {
        jokerDispatch.toggleJokerRunning(false)
        cb?.(resp)
        res(resp)
      }
    )

    /**
    * Listens for a cancel event
    * When called, cancels the promise and cleans up the automation
    * Calls clean up events on both backend and frontend
    *
    */
    const cancelOff = EE.on(
      WSCancelJokerReqEvt,
      () => {
        jokerDispatch.toggleJokerRunning(false)

        // Send event to cancel locally
        EE.emit(CancelJokerReqEvt)

        // Send event to cancel on the backend
        WSService.emit(SocketMsgTypes.TESTS_RUN_ABORT)

        // Finally stop listening, cancel and reject
        cancelOff?.()
        promise.cancel()

        // @ts-ignore
        promise = undefined

        onJokerRespOff?.()
        onJokerRespOff = undefined
        rej(emptyObj)
      }
    )

  })

  return promise
}