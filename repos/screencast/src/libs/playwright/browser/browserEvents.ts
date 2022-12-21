import type {
  TBrowserPage,
  TBrowserEventCB,
  TOnBrowserEvents
} from '@GSC/types'

import { startBrowser } from './browser'
import { EBrowserEvent } from '@GSC/types'

class BrowserEventListener {
  name:EBrowserEvent
  methods:TBrowserEventCB[]

  constructor(
    name:EBrowserEvent,
    methods:TBrowserEventCB[],
    page:TBrowserPage
  ){
    this.name = name
    this.methods = methods

    page.on(this.name as any, (...args:any[]) => Promise.all(this.methods.map(method => method?.(...args))))
    
    page.on(EBrowserEvent.close, () => {
      this.methods = undefined
      delete this.methods
    })
  }

}

export const browserEvents = async (props:TOnBrowserEvents) => {
  const {
    events,
    browserConf,
    pwComponents
  } = props

  const { page } = pwComponents || await startBrowser(browserConf)
  Object.entries(events).forEach(
    ([ event, methods ]:[EBrowserEvent, TBrowserEventCB[]]) => new BrowserEventListener(event, methods, page)
  )
}