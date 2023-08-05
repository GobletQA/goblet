import type playwright from 'playwright'
import type {
  TScreenDims,
  TGobletConfig,
  TBrowserContextGeo,
  TBrowserContextOpts,
  TBrowserContextVideo,
} from '@GSC/types'

import { artifactSaveActive } from '@gobletqa/browser'
import { getScreenDims } from '@gobletqa/shared/utils/getScreenDims'
import { parseJsonEnvArr } from '@gobletqa/shared/utils/parseJsonEnvArr'
import {
  isArr,
  isNum,
  isObj,
  toBool,
  exists,
  emptyObj,
} from '@keg-hub/jsutils'

/**
 * Parses the GOBLET_CONTEXT_GEO env into an object 
 */
const parseGeo = (value:string) => {
  if(!exists(value)) return emptyObj
  const {geo} = parseJsonEnvArr('geo', value)

  // Only add geo if it's the correct type, and it has a value
  if(!geo || !isArr(geo) || !geo.length) return emptyObj

  // Same order as how it should be entered from the cmd line lat,long,acc
  return [`latitude`, `longitude`, `accuracy`].reduce((acc, key, idx) => {
    const parsed = parseInt(geo[idx])
    if(!isNum(parsed)) return acc
    
    acc.geolocation = (acc.geolocation || {}) as TBrowserContextGeo
    acc.geolocation[key] = parsed

    return acc
  }, {} as Partial<TBrowserContextOpts>)
}

/**
 * Check's the passed in value, and adds it to the options if it exists
 */
const addEnvToOpts = (opts, key, value) => {
  exists(value) && (opts[key] = value)

  return opts
}

/**
 * Parses the GOBLET_TEST_VIDEO_RECORD env, and sets the height and width if true
 */
const parseRecord = (
  config:TGobletConfig,
  opts:Partial<TBrowserContextOpts>,
  screenDims:TScreenDims,
  shouldRecordVideo:boolean,
  fullScreen:boolean
) => {
  if(!shouldRecordVideo) return opts

  opts.recordVideo = (opts.recordVideo || {}) as TBrowserContextVideo
  opts.recordVideo.size = isObj(screenDims)
    ? !fullScreen
      ? {height: screenDims.height / 2, width: screenDims.width / 2}
      : screenDims
    : {} as TScreenDims

  // Save videos to the temp dir, and copy them to the repo dir as needed
  // I.E. a test fails
  const { videosTempDir } = config.internalPaths
  opts.recordVideo.dir = videosTempDir

  return opts
}

/**
 * Gets the browser opts set as envs when a task is run
 * This allows passing values into the test environment
 */
export const taskEnvToContextOpts = (config:TGobletConfig) => {
  const {
    GOBLET_CONTEXT_TZ, // string
    GOBLET_CONTEXT_GEO, // JSON array
    GOBLET_CONTEXT_TOUCH, // boolean
    GOBLET_CONTEXT_MOBILE, // boolean
    GOBLET_CONTEXT_DOWNLOADS, // boolean
    GOBLET_CONTEXT_PERMISSIONS,  // JSON array
    GOBLET_FULL_SCREEN_VIDEO, // boolean
    GOBLET_TEST_VIDEO_RECORD, // boolean || string
  } = process.env

  const opts = {
    ...parseJsonEnvArr('permissions', GOBLET_CONTEXT_PERMISSIONS),
    ...parseGeo(GOBLET_CONTEXT_GEO),
  } as Partial<TBrowserContextOpts>

  addEnvToOpts(opts, 'timezoneId', GOBLET_CONTEXT_TZ)
  addEnvToOpts(opts, 'hasTouch', toBool(GOBLET_CONTEXT_TOUCH))
  addEnvToOpts(opts, 'isMobile', toBool(GOBLET_CONTEXT_MOBILE))
  addEnvToOpts(opts, 'acceptDownloads', toBool(GOBLET_CONTEXT_DOWNLOADS))

  const screenDims = getScreenDims()

  parseRecord(
    config,
    opts,
    screenDims,
    artifactSaveActive(GOBLET_TEST_VIDEO_RECORD),
    toBool(GOBLET_FULL_SCREEN_VIDEO)
  )

  if(screenDims.height || screenDims.width){
    addEnvToOpts(opts, 'viewport', screenDims)
    addEnvToOpts(opts, 'screen', screenDims)
  }

  return opts as TBrowserContextOpts
}
