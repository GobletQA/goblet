import type { EBrowserName } from '../types'
import {deepFreeze} from '@keg-hub/jsutils/deepFreeze'

export const ChildBrowserServerKey = `child-playwright-server`
export const GobletQAUrl = process.env.GB_GOBLET_URL || `https://www.gobletqa.com`
export const browserStatus = {
  stopped: `stopped`,
  running: `running`,
  unknown: `unknown`,
  starting: `starting`,
}

export const PWLogFilter = [
  // Disabled these for now, until figure out whats needed
  // Need to figure out how to pipe pw:channel events?
  `SEND ► {`,
  `◀ RECV {`,
  `pw:channel:`,
  `[err] ALSA lib`,
  `dri3 extension not supported`,
  `Failed to connect to the bus`,
  `Failed to adjust OOM score of renderer`,
]

export const CreateBrowserRetry = 300

export const PWEventErrorLogFilter = {
  contains: [
    `waiting.*\\dms`,
    `===== logs =====`,
    `================`,
    `retrying click action, attempt #`
  ]
}

export const DefaultBrowser = `chromium` as EBrowserName
export const CanRecordVideo = [DefaultBrowser]
const FFBrowser = `firefox` as EBrowserName
const WKBrowser = `webkit` as EBrowserName

export const BrowserNames = deepFreeze<EBrowserName[]>([
  DefaultBrowser,
  FFBrowser,
  WKBrowser,
])
export const FullBrowserNames:EBrowserName[] = Object.values(BrowserNames)

// Browser names and shortcuts to the the real browser names
export const BrowserMap = {
  ff: FFBrowser,
  fox: FFBrowser,
  firefox: FFBrowser,
  wk: WKBrowser,
  webkit: WKBrowser,
  sa: WKBrowser,
  safari: WKBrowser,
  ch: DefaultBrowser,
  chrome: DefaultBrowser,
  chromium: DefaultBrowser,
} as Record<string, EBrowserName>