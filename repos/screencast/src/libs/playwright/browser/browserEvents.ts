import type {
  TPWComponents,
  TBrowserPage,
  TBrowserEvents,
  TBrowserEventCB,
  TOnAutomateEvent,
  TBrowserEventArgs,
} from '@GSC/types'

import { Events } from './events'
import { EBrowserEvent } from '@GSC/types'
import { ensureArr } from '@keg-hub/jsutils'
import { Automate } from '@GSC/libs/playwright/automate/automate'
import { startBrowser } from '@GSC/libs/playwright/browser/browser'
import { joinBrowserConf } from '@gobletqa/shared/utils/joinBrowserConf'

type ListenerList = Record<EBrowserEvent, BrowserEvents>

export class BrowserEvents {

  static onCloseListen:boolean
  static listeners:ListenerList={} as ListenerList


  static registerEvents = async (
    events:TBrowserEvents,
    page:TBrowserPage
  ) => {
    // Setup browser page event listeners
    Object.entries(events).forEach(
      ([ event, methods ]:[EBrowserEvent, TBrowserEventCB[]]) => {
        BrowserEvents.registerEvent(
          event,
          methods,
          page
        )
      }
    )
  }

  /**
   * Check if the listener name already exists
   * Creates a new listener if it does not exist
   * Otherwise adds methods to the existing listener
   */
  static registerEvent = (
    name:EBrowserEvent,
    callback:TBrowserEventCB|TBrowserEventCB[],
    page:TBrowserPage
  ) => {
    const events = ensureArr<TBrowserEventCB>(callback)

    // Create a new listener if none exists for the event name
    if(!BrowserEvents.listeners[name])
      return new BrowserEvents(
        name,
        events,
        page
      )

    // Add the methods to it if it already exists
    const listener = BrowserEvents.listeners[name]
    listener.methods.push(...events)

    return listener
  }

  /**
   * Sets a listener for the Automate class
   * Just a helper method
   * Used to listen for automate events from the same events class
   */
  static automateEvent = (
    pwComponents?: TPWComponents,
    AutomateEvent?: TOnAutomateEvent,
  ) => {
    // Setup Automate event listener
    AutomateEvent
      && Automate.addEventListener(pwComponents, AutomateEvent)
  }

  /**
   * Listener for the page.onclose event
   * Removes the event listeners when fired
   */
  static onPageClose = (page:TBrowserPage) => {
    if(this.onCloseListen) return

    this.onCloseListen = true
    page.on(EBrowserEvent.close, () => {
      let listeners = Object.entries({...BrowserEvents.listeners})
      listeners.forEach(([name, listener]) => {
        listener.methods = undefined
        delete listener.methods

        BrowserEvents.listeners[name] = undefined
        delete BrowserEvents.listeners[name]
      })

      listeners = undefined
      BrowserEvents.listeners = {} as ListenerList
    })
  }


  name:EBrowserEvent
  methods:TBrowserEventCB[]

  constructor(
    name:EBrowserEvent,
    methods:TBrowserEventCB[],
    page:TBrowserPage
  ){
    this.name = name
    this.methods = methods

    page.on(this.name as any, (...args:any[]) => 
      Promise.all(this.methods.map(method => method?.(page, ...args)))
    )

    BrowserEvents.onPageClose(page)
    BrowserEvents.listeners[name] = this
  }

}

export const browserEvents = async (args:TBrowserEventArgs) => {
  const pwComponents = args.pwComponents
    || await startBrowser({ browserConf: joinBrowserConf(args.browserConf) })

  const { Automate, ...browserEvts } = Events(args)

  BrowserEvents.automateEvent(pwComponents, Automate)
  BrowserEvents.registerEvents(browserEvts, pwComponents.page)

}
