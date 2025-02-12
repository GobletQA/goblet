import type {
  TScreenDims,
  TBrowserContextGeo,
  TBrowserContextVideo,
  TBrowserContextOpts,
} from '@GBB/types'

import { ENVS } from '@gobletqa/environment'
import { isArr } from '@keg-hub/jsutils/isArr'
import { isNum } from '@keg-hub/jsutils/isNum'
import { isObj } from '@keg-hub/jsutils/isObj'
import { exists } from '@keg-hub/jsutils/exists'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { parseJsonEnvArr } from '@GBB/utils/parseJsonEnvArr'
import { ArtifactSaveOpts, InternalPaths } from '@gobletqa/environment/constants'



/**
 * Gets the screen dimensions from the current ENV
 * Uses GOBLET_CONTEXT_WIDTH && GOBLET_CONTEXT_HEIGHT envs first
 * 
 * @returns {Object} - Screen Dims Object
 */
export const getScreenDims = () => {
  if(!ENVS.GOBLET_CONTEXT_WIDTH && !ENVS.GOBLET_CONTEXT_HEIGHT) return

  const width = ENVS.GOBLET_CONTEXT_WIDTH
  const height = ENVS.GOBLET_CONTEXT_HEIGHT

  return {
    width: width || height,
    height: height || width,
  }
}


/**
 * Check if video recording is active
 * This is a duplicate of `artifactSaveOption` from `gobletqa/testify/src/utils/artifactSaveOption`
 * But we don't have access to that method here
 * It's only a few lines of code, but I would prefer to not duplicate it
 */
const shouldRecordVideo = (value:string|boolean) => {
  return !value || value === ArtifactSaveOpts.never
    ? false
    : value === ArtifactSaveOpts.always
      ? ArtifactSaveOpts.always
      : ArtifactSaveOpts.failed
}

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
  opts:Partial<TBrowserContextOpts>,
  screenDims:TScreenDims,
  recordVideoActive:boolean,
  fullScreen:boolean
) => {
  if(!recordVideoActive) return opts

  opts.recordVideo = (opts.recordVideo || {}) as TBrowserContextVideo
  if(isObj(screenDims))
    opts.recordVideo.size = !fullScreen
        ? {height: screenDims.height / 2, width: screenDims.width / 2}
        : screenDims

  // Save videos to the temp dir, and copy them to the repo dir as needed
  // I.E. a test fails
  const { videosTempDir } = InternalPaths
  opts.recordVideo.dir = videosTempDir

  return opts
}

/**
 * Gets the browser opts set as envs when a task is run
 * This allows passing values into the test environment
 */
export const taskEnvToContextOpts = () => {

  const opts = {
    ...parseJsonEnvArr('permissions', ENVS.GOBLET_CONTEXT_PERMISSIONS),
    ...parseGeo(ENVS.GOBLET_CONTEXT_GEO),
  } as Partial<TBrowserContextOpts>

  addEnvToOpts(opts, `timezoneId`, ENVS.GOBLET_CONTEXT_TZ)
  addEnvToOpts(opts, `hasTouch`, ENVS.GOBLET_CONTEXT_TOUCH)
  addEnvToOpts(opts, `isMobile`, ENVS.GOBLET_CONTEXT_MOBILE)
  addEnvToOpts(opts, `acceptDownloads`, ENVS.GOBLET_CONTEXT_DOWNLOADS)

  const screenDims = getScreenDims()

  parseRecord(
    opts,
    screenDims,
    shouldRecordVideo(ENVS.GOBLET_TEST_VIDEO_RECORD),
    ENVS.GOBLET_FULL_SCREEN_VIDEO
  )

  if(screenDims?.height || screenDims?.width){
    addEnvToOpts(opts, `viewport`, screenDims)
    addEnvToOpts(opts, `screen`, screenDims)
  }

  return opts as TBrowserContextOpts
}
