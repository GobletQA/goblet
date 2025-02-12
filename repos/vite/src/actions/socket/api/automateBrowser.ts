import type { TProm } from '@utils/promise/promiseAbort'
import type {
  TOffCB,
  TBrowserStateEvt,
  TUserAutomateOpts,
  TCancelAutomateRespEvent,
  TSelectFromBrowserRespEvent
} from '@types'

import { EBrowserState } from '@types'
import { emptyObj } from '@keg-hub/jsutils'
import { WSService } from '@services/socketService/socketService'
import {
  SocketMsgTypes,
  BrowserStateEvt,
  WSAutomateEvent,
  WSCancelAutomateEvent,
} from '@constants'

import { EE } from '@services/sharedService'
import { PromiseAbort } from '@utils/promise/promiseAbort'
import { getSettingsValues } from '@utils/settings/getSettingsValues'

/**
 * Calls websocket to turn on browser click listener
 * Which allows the user to select an element from the dom
 * Add listener the fires when the user clicks the dom
 *
 */
export const automateBrowser = (options:TUserAutomateOpts = emptyObj) => {

  let promise:TProm<any>|undefined = PromiseAbort<TSelectFromBrowserRespEvent>((res, rej) => {
    const browserOpts = getSettingsValues(`browser`)

    EE.emit<TBrowserStateEvt>(BrowserStateEvt, {browserState: EBrowserState.recording})

    WSService.emit(SocketMsgTypes.BROWSER_AUTOMATE, {
      ...options,
      browser: { ...browserOpts, ...options?.browser }
    })

    // Then listen for the response event fired from the websocket service
    let selectOff:TOffCB

    /**
    * Listens for a cancel event
    * When called, cancels the promise and cleans up the automation
    * Calls clean up events on both backend and frontend
    *
    */
    let cancelOff = EE.on<TCancelAutomateRespEvent>(
      WSCancelAutomateEvent,
      (data) => {
        // Turn off the select listener above
        selectOff?.()
        // Send event to cancel on the backend
        WSService.emit(SocketMsgTypes.CANCEL_AUTOMATE, emptyObj)
        // Sent event to cancel on the frontend
        EE.emit<TBrowserStateEvt>(BrowserStateEvt, {browserState: EBrowserState.idle})


        // Finally stop listening, cancel and reject
        cancelOff?.()
        cancelOff = undefined
        selectOff = undefined
        promise?.cancel?.()
        promise = undefined
        rej()
      }
    )

    selectOff = EE.on<TSelectFromBrowserRespEvent>(
      WSAutomateEvent,
      (data) => {
        selectOff?.()
        cancelOff?.()
        EE.emit<TBrowserStateEvt>(BrowserStateEvt, {browserState: EBrowserState.idle})
        selectOff = undefined
        cancelOff = undefined
        promise = undefined
        res(data)
      }
    )

  })

  return promise
}
