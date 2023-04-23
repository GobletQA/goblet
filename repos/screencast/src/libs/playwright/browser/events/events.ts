import type { Express } from 'express'
import type { Frame } from 'playwright'
import type {
  TAutomateEvent,
  TBrowserPage,
  TBrowserEventArgs,
  TSocketEvtCBProps,
} from '@GSC/types'

import { EBrowserEvent } from '@GSC/types'
import { Logger } from '@GSC/utils/logger'
import { ensureArr } from '@keg-hub/jsutils'
import { WS_PW_URL_CHANGE } from '@GSC/constants'
import { Automate } from '@GSC/libs/playwright/automate/automate'
import { startBrowser } from '@GSC/libs/playwright/browser/browser'
import { joinBrowserConf } from '@gobletqa/shared/utils/joinBrowserConf'
import { onFrameNavigated } from './onFrameNavigated'

export const Events = (
  app:Express,
  args:TBrowserEventArgs
) => {

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
    [onFrameNavigated.event]: onFrameNavigated(app, args),

    // TODO: Add these for tracking requests and responses from a page
    // [EBrowserEvent.request]: async (page:TBrowserPage, frame:Frame) => {},
    // [EBrowserEvent.requestfailed]: async (page:TBrowserPage, frame:Frame) => {},
    // [EBrowserEvent.requestfinished]: async (page:TBrowserPage, frame:Frame) => {},
    // [EBrowserEvent.response]: async (page:TBrowserPage, frame:Frame) => {},
  }

}

