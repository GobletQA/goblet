import { noOpObj } from '@keg-hub/jsutils'
import { SocketMsgTypes } from '@constants'
import { WSService } from '@services/socketService/socketService'


/**
 * Gets the browser status from the server
 *
 * @returns {void}
 */
export const selectElement = (options:Record<string, any> = noOpObj) => {
  WSService.emit(SocketMsgTypes.ELEMENT_SELECT, options)
}
