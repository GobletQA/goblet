import type { Express } from 'express'
import { Logger } from '@GSC/utils/logger'
import type { TSocketEvtCBProps } from '@GSC/types'
import { Automate } from '@GSC/libs/playwright/automate/automate'
import { getPWComponents } from '@GSC/libs/playwright/browser/browser'


export const cancelAutomate = (app:Express) => {
  return async ({ data, socket, Manager, user }:TSocketEvtCBProps) => {
    
    if(data?.player){
      const player = Manager.cache[socket.id].player
      if(!player || player.canceled) return

      Logger.info(`Canceling player...`)
      await player.cancel()
    }
    else {
      const pwComponents = await getPWComponents(data.browser)
      await Automate.cancel(pwComponents, data)
    }
  }
}
