import type { Express } from 'express'
import type { TSocketEvtCBProps } from '@GSC/types'

import { Logger } from '@GSC/utils/logger'
import { GBrowser, Automate } from '@gobletqa/browser'
import { joinBrowserConf } from '@GSC/utils/joinBrowserConf'


export const cancelAutomate = (app:Express) => {
  return async ({ data, socket, Manager, user }:TSocketEvtCBProps) => {
    
    // TODO: update to use EE.emit(KillPlayCodeRunnerEvt) to kill the browser automation process
    // This way we don't depend on Manager.cache
    if(data?.player){
      const player = Manager.cache[socket.id].player
      if(!player || player.canceled) return

      Logger.info(`Canceling player...`)
      await player.cancel()
    }
    else {
      const browserConf = joinBrowserConf(data.browser)
      const pwComponents = await GBrowser.get({ browserConf })
      await Automate.cancel(pwComponents, data)
    }
  }
}
