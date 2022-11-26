import { addToast } from '@actions/toasts'
import { SocketMsgTypes } from '@constants'
import { dispatch, getStore } from '@store'
import { noOpObj, get } from '@keg-hub/jsutils'
import { WSService } from '@services/socketService'
import { setBrowserStatus } from '../local/setBrowserStatus'

/**
 * Gets the browser status from the server
 * @param {Object} data - Message data from the socket
 * @param {Object} testRunModel - The test run model to set running to false
 *
 * @returns {void}
 */
export const watchBrowserStatus = (options:Record<string, any> = noOpObj) => {
  console.log(`------- TOOD: setup watch browser status -------`)  
  // WSService.emit(SocketMsgTypes.BROWSER_STATUS, {  
  //   ...noOpObj,
  // })
}
