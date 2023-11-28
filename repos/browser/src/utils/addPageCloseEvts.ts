import type { TBrowserPage } from '@GBB/types'

import { EBrowserEvent } from '@GBB/types'
import { BrowserEvents } from '@GBB/browser/browserEvents'

type ListenerList = Record<EBrowserEvent, BrowserEvents>

export const addPageCloseEvts = (page:TBrowserPage) => {
  if(page?.__pageGoblet?.hasCloseEvt) return

  page.on(EBrowserEvent.close, async () => {
    let listeners = Object.entries({...BrowserEvents.listeners})
    listeners.forEach(([name, listener]) => {
      listener.methods = undefined
      delete listener.methods

      BrowserEvents.listeners[name] = undefined
      delete BrowserEvents.listeners[name]
    })

    listeners = undefined
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
  })

  page.on(`crash`, (data) => {
    console.error(`ERROR - Browser page crashed`)
    console.log(data)
  })

  page.__pageGoblet = page?.__pageGoblet || {}
  page.__pageGoblet.hasCloseEvt = true

}