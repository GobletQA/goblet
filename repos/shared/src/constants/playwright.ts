import { EBrowserName } from '@GSH/types'
import {deepFreeze, keyMap} from '@keg-hub/jsutils'

export const canRecordVideo = [EBrowserName.chromium]
export const ChildBrowserServerKey = `child-playwright-server`
export const GobletQAUrl = process.env.GB_GOBLET_URL || `https://www.gobletqa.com`
export const browserStatus = keyMap([`stopped`, `running`, `starting`, `unknown`])

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

export const PWEventErrorLogFilter = [
  `===== logs =====`,
  `================`
]

export const defaultBrowser = EBrowserName.chromium


export const browserNames = deepFreeze<EBrowserName[]>([
  EBrowserName.chromium,
  EBrowserName.firefox,
  EBrowserName.webkit,
])
export const FullBrowserNames:EBrowserName[] = Object.values(browserNames)

// Browser names and shortcuts to the the real browser names
export const browserMap = {
  ff: EBrowserName.firefox,
  fox: EBrowserName.firefox,
  firefox: EBrowserName.firefox,
  wk: EBrowserName.webkit,
  webkit: EBrowserName.webkit,
  sa: EBrowserName.webkit,
  safari: EBrowserName.webkit,
  ch: EBrowserName.chromium,
  chrome: EBrowserName.chromium,
  chromium: EBrowserName.chromium,
} as Record<string, EBrowserName>