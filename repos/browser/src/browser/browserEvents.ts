import type {
  TPWComponents,
  TBrowserPage,
  TBrowserEvents,
  TBrowserEventCB,
  TOnAutomateEvent,
  TBrowserEventArgs,
} from '@gobletqa/shared/types'

import { Automate } from '../automate'
import { EBrowserEvent } from '@gobletqa/shared/enums'
import { ensureArr } from '@keg-hub/jsutils/ensureArr'
import { addPageCloseEvts } from '@GBB/utils/addPageCloseEvts'

type ListenerList = Record<EBrowserEvent, BrowserEvents>
type TBrowserEvtsRegister = {
  page:TBrowserPage
  events:TBrowserEvents
  args:TBrowserEventArgs
}

type TBrowserAutomateEvt = {
  args:TBrowserEventArgs
  event?: TOnAutomateEvent
  pwComponents?: TPWComponents
}

export class BrowserEvents {

  static onCloseListen:boolean
  static listeners:ListenerList={} as ListenerList


  static registerEvents = ({
    args,
    page,
    events,
  }:TBrowserEvtsRegister) => {
    // Setup browser page event listeners
    Object.entries(events).forEach(
      ([ event, methods ]:[EBrowserEvent, TBrowserEventCB[]]) => {
        BrowserEvents.registerEvent(
          event,
          methods,
          page,
          args
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
    page:TBrowserPage,
    args:TBrowserEventArgs,
  ) => {
    const events = ensureArr<TBrowserEventCB>(callback)
    // Add the methods to it if it already exists
    const listener = BrowserEvents.listeners[name]

    // Create a new listener if none exists for the event name
    if(!listener)
      return new BrowserEvents(
        name,
        events,
        page,
        args
      )

    const filtered = events.filter(method => !listener?.methods?.includes(method))
    listener.methods.push(...filtered)

    return listener
  }

  /**
   * Sets a listener for the Automate class
   * Just a helper method
   * Used to listen for automate events from the same events class
   */
  static automateEvent = ({
    args,
    event,
    pwComponents,
  }:TBrowserAutomateEvt) => {
    // Setup Automate event listener
    event
      && Automate.addEventListener(pwComponents, event, args)
  }

  /**
   * Listener for the page.onclose event
   * Removes the event listeners when fired
   */
  static onPageClose = (page:TBrowserPage) => {
    if(this.onCloseListen) return

    this.onCloseListen = true
    addPageCloseEvts(page)
  }


  name:EBrowserEvent
  methods:TBrowserEventCB[]

  constructor(
    name:EBrowserEvent,
    methods:TBrowserEventCB[],
    page:TBrowserPage,
    args:TBrowserEventArgs,
  ){
    this.name = name
    this.methods = methods
    page.__pageGoblet = page?.__pageGoblet || {}

    !page.__pageGoblet[this.name]
      && page.on(this.name as any, (...pwArgs:any[]) => Promise.all(
          this.methods.map(method => method?.(page, ...pwArgs, args))
        ))

    page.__pageGoblet[this.name] = true
    BrowserEvents.onPageClose(page)
    BrowserEvents.listeners[name] = this
  }

}
