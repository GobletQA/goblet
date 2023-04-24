import { SocketMsgTypes } from '@constants'
import { noOpObj } from '@keg-hub/jsutils'
import { WSService } from '@services/socketService'


/**
 * Gets the browser status from the server
 *
 * @returns {void}
 */
export const getBrowserStatus = (options:Record<string, any> = noOpObj) => {
  WSService.emit(SocketMsgTypes.BROWSER_STATUS, {
    ...noOpObj,
  })
}
