import type { TBrowserEventArgs } from '@GSC/types'
import { joinBrowserConf } from '@gobletqa/shared/utils/joinBrowserConf'
import {
  Events,
  GBrowser,
  BrowserEvents,
} from '@gobletqa/browser'


export const browserEvents = async (args:TBrowserEventArgs) => {
  const pwComponents = args.pwComponents
    || await GBrowser.start({ browserConf: joinBrowserConf(args.browserConf) })

  const { Automate, ...browserEvts } = Events(args)

  BrowserEvents.automateEvent(pwComponents, Automate)
  BrowserEvents.registerEvents(browserEvts, pwComponents.page)

}
