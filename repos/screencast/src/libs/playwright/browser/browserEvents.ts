import type {
  TBrowserPage,
  TBrowserEventCB,
  TOnBrowserEvents
} from '@GSC/types'

import { startBrowser } from './browser'
import { EBrowserEvent } from '@GSC/types'
import { Automate } from '@GSC/libs/playwright/automate/automate'

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

    page.on(this.name as any, (...args:any[]) => Promise.all(this.methods.map(method => method?.(page, ...args))))
    
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
    automateEvent,
  } = props

  const pwComponents = props.pwComponents || await startBrowser(browserConf)

    // Setup Automate event listener
  automateEvent
    && Automate.addEventListener(pwComponents, automateEvent)

  // Setup browser page event listeners
  Object.entries(events).forEach(
    ([ event, methods ]:[EBrowserEvent, TBrowserEventCB[]]) => new BrowserEventListener(
      event,
      methods,
      pwComponents.page
    )
  )

}