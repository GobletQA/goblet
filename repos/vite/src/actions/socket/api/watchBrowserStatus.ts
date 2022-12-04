import { addToast } from '@actions/toasts'
import { SocketMsgTypes } from '@constants'
import { dispatch, getStore } from '@store'
import { noOpObj, get } from '@keg-hub/jsutils'
import { WSService } from '@services/socketService'
import { setBrowserStatus } from '../local/setBrowserStatus'

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
