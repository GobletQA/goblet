import { emptyObj } from '@keg-hub/jsutils'
import { SocketMsgTypes } from '@constants'
import { GobletQAUrl } from '@constants/values'
import { pageService } from '@services/pageService'
import { getWorldVal } from '@utils/repo/getWorldVal'
import { WSService } from '@services/socketService/socketService'
import { getSettingsValues } from '@utils/settings/getSettingsValues'


/**
 * Gets the browser status from the server
 *
 * @returns {void}
 */
export const restartBrowserContext = async (options:Record<string, any> = emptyObj) => {
  const browserOpts = getSettingsValues(`browser`)
  const url = getWorldVal({
    location: `url`,
    fallback: `app.url`,
    def: GobletQAUrl
  })

  
  const normal = pageService.normalize(url)
  if(!normal) return

  WSService.emit(SocketMsgTypes.BROWSER_RESTART, {
    url: pageService.normalize(url),
    browser: {
      ...browserOpts,
      ...options,
    }
  })
}

