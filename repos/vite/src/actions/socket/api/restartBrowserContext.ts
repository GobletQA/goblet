import type { TBrowserIsLoadedEvent, TSocketEmitData, TBrowserConf } from '@types'

import { GobletQAUrl } from '@constants/values'
import { pageService } from '@services/pageService'
import { SetBrowserIsLoadedEvent } from '@constants'
import { getWorldVal } from '@utils/repo/getWorldVal'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { SocketMsgTypes, BrowserResetUrlEvt } from '@constants'
import { WSService } from '@services/socketService/socketService'
import { getSettingsValues } from '@utils/settings/getSettingsValues'


/**
 * Gets the browser status from the server
 *
 * @returns {void}
 */
export const restartBrowserContext = (
  options?:Partial<TBrowserConf>,
  resetUrl:boolean=true
) => {

  const browserOpts = getSettingsValues(`browser`)
  const opts:TSocketEmitData = { browser: {...browserOpts, ...options} }

  if(resetUrl){
    EE.emit(BrowserResetUrlEvt)

    const url = getWorldVal({
      location: `url`,
      fallback: `app.url`,
      def: GobletQAUrl
    })
    const normal = pageService.normalize(url)
    if(!normal) return

    opts.url = normal
  }

  EE.emit<TBrowserIsLoadedEvent>(SetBrowserIsLoadedEvent, { state: false })

  WSService.emit(SocketMsgTypes.BROWSER_RESTART, opts)
}

