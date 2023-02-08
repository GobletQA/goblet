import type { TSelectFromBrowserRespEvent } from '@types'
import { noOpObj } from '@keg-hub/jsutils'
import { WSService } from '@services/socketService/socketService'
import { SelectFromBrowserRespEvt, SocketMsgTypes } from '@constants'

import { EE } from '@gobletqa/shared/libs/eventEmitter'


/**
 * Calls websocket to turn on browser click listener
 * Which allows the user to select an element from the dom
 * Add listener the fires when the user clicks the dom
 *
 * @returns {void}
 */
export const selectElement = (options:Record<string, any> = noOpObj) => {
  let offEvent:any
  return new Promise<TSelectFromBrowserRespEvent>((res, rej) => {
    WSService.emit(SocketMsgTypes.ELEMENT_SELECT, options)

    // Then listen for the response event fired from the websocket service
    offEvent = EE.on<TSelectFromBrowserRespEvent>(
      SelectFromBrowserRespEvt,
      (data) => {
        offEvent?.()
        res(data)
      }
    )
  })
}


