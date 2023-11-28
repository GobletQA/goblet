
import type { TGenEnv } from '../types'
import type screencast from './screencast'

import { asNum } from "../utils/asNum"
import { asBool } from "../utils/asBool"

const browser = (general:TGenEnv, scEnvs:ReturnType<typeof screencast>) => {

  const {
    GOBLET_HEADLESS,
    GB_WS_BROWSER,
    GOBLET_DEV_TOOLS,
    GOBLET_BROWSER_DEVICES,
    GOBLET_BROWSER = `chromium`,
    GOBLET_BROWSER_SLOW_MO = `50`,
    GOBLET_BROWSER_TIMEOUT = `15000`, // 15 seconds
    GOBLET_CONTEXT_TZ, // string
    GOBLET_CONTEXT_GEO, // JSON array
    GOBLET_CONTEXT_TOUCH, // boolean
    GOBLET_CONTEXT_MOBILE, // boolean
    GOBLET_CONTEXT_DOWNLOADS, // boolean
    GOBLET_CONTEXT_PERMISSIONS,  // JSON array
    GOBLET_FULL_SCREEN_VIDEO, // boolean
    GOBLET_CONTEXT_WIDTH=scEnvs.GB_VNC_VIEW_WIDTH, // number
    GOBLET_CONTEXT_HEIGHT=scEnvs.GB_VNC_VIEW_HEIGHT, // number
  } = process.env

  return {
    GOBLET_BROWSER,
    GOBLET_BROWSER_DEVICES,
    GB_WS_BROWSER: asBool(GB_WS_BROWSER),
    GOBLET_HEADLESS: asBool(GOBLET_HEADLESS),
    GOBLET_DEV_TOOLS: asBool(GOBLET_DEV_TOOLS),
    GOBLET_BROWSER_SLOW_MO: asNum(GOBLET_BROWSER_SLOW_MO),
    GOBLET_BROWSER_TIMEOUT: asNum(GOBLET_BROWSER_TIMEOUT),
    GOBLET_CONTEXT_TZ,
    GOBLET_CONTEXT_GEO,
    GOBLET_CONTEXT_PERMISSIONS,
    GOBLET_CONTEXT_TOUCH: asBool(GOBLET_CONTEXT_TOUCH),
    GOBLET_CONTEXT_MOBILE: asBool(GOBLET_CONTEXT_MOBILE),
    GOBLET_CONTEXT_WIDTH: asNum(GOBLET_CONTEXT_WIDTH, { exists: true, default: undefined }),
    GOBLET_CONTEXT_HEIGHT: asNum(GOBLET_CONTEXT_HEIGHT, { exists: true, default: undefined }),
    GOBLET_CONTEXT_DOWNLOADS: asBool(GOBLET_CONTEXT_DOWNLOADS, { exists: true, default: true }),
    GOBLET_FULL_SCREEN_VIDEO: asBool(GOBLET_FULL_SCREEN_VIDEO, { exists: true, default: true }),
  }
}

export default browser
