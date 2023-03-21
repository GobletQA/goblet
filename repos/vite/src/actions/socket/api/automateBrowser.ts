import type { TSelectFromBrowserRespEvent } from '@types'

import { EBrowserState } from '@types'
import { noOpObj } from '@keg-hub/jsutils'
import { WSService } from '@services/socketService/socketService'
import {
  SocketMsgTypes,
  BrowserStateEvt,
  WSAutomateEvent,
} from '@constants'

import { EE } from '@gobletqa/shared/libs/eventEmitter'


/**
 * Calls websocket to turn on browser click listener
 * Which allows the user to select an element from the dom
 * Add listener the fires when the user clicks the dom
 *
 */
export const automateBrowser = (options:Record<string, any> = noOpObj) => {

  /**
   * TODO - Need to add some type of cancel / timeout if there's an error
   * This will ensure the browser doesn't get stuck in an odd state
   */
  
  let offEvent:any
  return new Promise<TSelectFromBrowserRespEvent>((res, rej) => {
    EE.emit(BrowserStateEvt, {browserState: EBrowserState.recording})

    WSService.emit(SocketMsgTypes.BROWSER_AUTOMATE, options)

    // Then listen for the response event fired from the websocket service
    offEvent = EE.on<TSelectFromBrowserRespEvent>(
      WSAutomateEvent,
      (data) => {

        EE.emit(BrowserStateEvt, {browserState: EBrowserState.idle})
        offEvent?.()

        res(data)
      }
    )
  })
}
