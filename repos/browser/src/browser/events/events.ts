import type { Frame } from 'playwright'
import type {
  TAutomateEvent,
  TBrowserEventArgs,
} from '@GBR/types'

import { Logger } from '@GBR/utils/logger'
import { onFrameNavigated } from './onFrameNavigated'

export const Events = (args:TBrowserEventArgs) => {

  const { socket, Manager } = args

  return {
    /**
     * Only event that is not a playwright events
     * But it tracks playwright browser activity, so it makes sense to go here
     */
    Automate: (event:TAutomateEvent) => {
      Logger.verbose(`Emit ${event.name} event`, event)
      Manager.emit(socket, event.name, {...event, group: socket.id })
    },

    /**
     * All events below are Playwright page specific events
     * For more info go here => https://playwright.dev/docs/api/class-page#events
     */
    [onFrameNavigated.event]: onFrameNavigated(args),

    // TODO: Add these for tracking requests and responses from a page
    // [EBrowserEvent.request]: async (page:TBrowserPage, frame:Frame) => {},
    // [EBrowserEvent.requestfailed]: async (page:TBrowserPage, frame:Frame) => {},
    // [EBrowserEvent.requestfinished]: async (page:TBrowserPage, frame:Frame) => {},
    // [EBrowserEvent.response]: async (page:TBrowserPage, frame:Frame) => {},
  }

}

