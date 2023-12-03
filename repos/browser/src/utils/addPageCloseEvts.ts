import type { TBrowserPage } from '@GBB/types'

import { Logger } from './logger'
import { EBrowserEvent } from '@GBB/types'
import { BrowserEvents } from '@GBB/browser/browserEvents'

type ListenerList = Record<EBrowserEvent, BrowserEvents>

/**
 * Adds event listeners to the page `close` and `crash` events
 * Ensure the extra added goblet meta data is removed
 */
export const addPageCloseEvts = (page:TBrowserPage) => {
  if(page?.__pageGoblet?.hasCloseEvt) return

  page.on(EBrowserEvent.close, async () => {
    try {
      BrowserEvents.listeners = {} as ListenerList

      if(page.__GobletAutomateInstance){
        let automate = page.__GobletAutomateInstance
        if(automate?.parent === page) await automate?.cleanUp?.()

        automate = undefined
        page.__GobletAutomateInstance = undefined
      }
      
      if(page.__pageGoblet){
        page.__pageGoblet.video = undefined
        page.__pageGoblet.initFuncs = undefined
        page.__pageGoblet.initScript = undefined
        page.__pageGoblet.hasCloseEvt = undefined
      }
      page.__pageGoblet = undefined
    }
    catch(err){
      Logger.error(err)
    }
  })

  page.on(`crash`, (data) => {
    Logger.warn(`ERROR - Browser page crashed`)
    Logger.log(data)
  })

  page.__pageGoblet = page?.__pageGoblet || {}
  page.__pageGoblet.hasCloseEvt = true
}