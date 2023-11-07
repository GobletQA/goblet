import type { Frame, ConsoleMessage } from 'playwright'
import type {
  TBrowserPage,
  TAutomateEvent,
  TBrowserEventArgs
} from '@GSC/types'
import { Logger } from '@GBB/utils/logger'
import { wait } from '@keg-hub/jsutils/wait'
import { joinBrowserConf } from '@GSC/utils/joinBrowserConf'
import {
  GBrowser,
  WSPwConsole,
  WSPwUrlChange,
  EBrowserEvent,
  BrowserEvents,
} from '@gobletqa/browser'

/**
 * **IMPORTANT** The function identity must be consistent
 * Otherwise duplicate listeners will be added to the browser
 */
export const Events = {
    /**
     * Only event that is not a playwright events
     * But it tracks playwright browser activity, so it makes sense to go here
     */
    automate: (event:TAutomateEvent, args:TBrowserEventArgs) => {
      Logger.verbose(`Emit ${event.name} event`, event)
      args.Manager.emitAll(event.name, event)
    },

    /**
     * All events below are Playwright page specific events
     * For more info go here => https://playwright.dev/docs/api/class-page#events
     */
    [EBrowserEvent.framenavigated]:(page:TBrowserPage, frame:Frame, args:TBrowserEventArgs) => {
      /**
        * Check if frame is the top most frame
        * If frame if parent, then response is null
        * Any child frames will return the parent
        * And we don't want to track their navigation, so return in those cases
        */
      if(frame.parentFrame()) return

      const url = frame.url()
      args.Manager.emitAll(WSPwUrlChange, {data: { url, ast: [] }})
    },

    // [EBrowserEvent.console]: async (page:TBrowserPage, message:ConsoleMessage, args:TBrowserEventArgs) => {
    //   // TODO: add check for forwarding logs to the args object
      
    //   args?.browserConf?.forwardLogs
    //     && args.Manager.emitAll(WSPwConsole, {data: {
    //         type: message.type(),
    //         text: message.text(),
    //         location: message.location(),
    //       }})
    // }

    // TODO: Add these for tracking requests and responses from a page
    // [EBrowserEvent.request]: async (page:TBrowserPage, frame:Frame) => {},
    // [EBrowserEvent.requestfailed]: async (page:TBrowserPage, frame:Frame) => {},
    // [EBrowserEvent.requestfinished]: async (page:TBrowserPage, frame:Frame) => {},
    // [EBrowserEvent.response]: async (page:TBrowserPage, frame:Frame) => {},
  }



export const browserEvents = async (args:TBrowserEventArgs) => {
  // This is a hack because sometime the passed in browser is not fully initialized
  // Which causes the events to not properly bind to the browser
  // So we wait a second, before attempting to set the browser events
  await wait(500)

  const pwComponents = args.pwComponents
    || await GBrowser.start({ browserConf: joinBrowserConf(args.browserConf) })

  const { automate, ...browserEvts } = Events

  BrowserEvents.automateEvent({
    pwComponents,
    event: automate,
    args: {...args, pwComponents }
  })

  BrowserEvents.registerEvents({
    events: browserEvts,
    page: pwComponents.page,
    args: {...args, pwComponents }
  })

}
