import { noOpObj } from '@keg-hub/jsutils'
import { SocketMsgTypes } from '@constants'
import { WSService } from '@services/socketService/socketService'


/**
 * Gets the browser status from the server
 * @param {Object} data - Message data from the socket
 * @param {Object} testRunModel - The test run model to set running to false
 *
 * @returns {void}
 */
export const setRecorderStatus = (options:Record<string, any> = noOpObj) => {
  WSService.emit(SocketMsgTypes.BROWSER_RECORDER, options)
}
