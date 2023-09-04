import type {
  EBrowserName,
  TBrowserConf,
  TGobletConfig,
  TGobletTestOpts,
  TBrowserContextOpts,
} from '@GTU/Types'

import path from 'path'
import { ENVS } from '@gobletqa/environment'
import { toBool } from '@keg-hub/jsutils/toBool'
import { exists } from '@keg-hub/jsutils/exists'
import { getPathFromBase } from '@gobletqa/goblet'
import {
  CanRecordVideo,
  BrowserArtifactTypes,
} from '@gobletqa/browser'

import {
  artifactSaveActive,
  artifactSaveOption,
} from './artifactSaveOption'

/**
 * Builds the repo paths to artifacts generated at test run
 */
const buildArtifactsPaths = (
  config:TGobletConfig,
  options
) => {
  const { artifactsDir } = config.paths
  BrowserArtifactTypes.map(type => {
    // Check for a custom location set as an ENV
    // If set, use that env, otherwise use the relative path from the config artifactsDir
    const baseDir = process.env[`GOBLET_${type.toUpperCase()}_DIR`] || artifactsDir

    options[`${type}Dir`] = getPathFromBase(path.join(baseDir, `${type}/`), config)
  })
}

/**
 * Global options for goblet passed to the Jest config global object
 * All values must be serializable
 * @param {Object} config - Goblet config
 * @param {Object} browserOpts - Configure browser options
 *
 * @returns {Object} - goblet options for executing tests
 */
export const buildTestGobletOpts = (
  config:TGobletConfig,
  browserOpts:TBrowserConf,
  contextOpts?:TBrowserContextOpts
) => {

    // TODO: add cli options for these
    // Currently can be set by ENV only
    // GOBLET_PAGE_REUSE, // PW_TEST_REUSE_PAGE
    // GOBLET_CONTEXT_REUSE, // PW_TEST_REUSE_CONTEXT
    // GOBLET_TEST_TRACING_SNAPSHOTS=true,
    // GOBLET_TEST_TRACING_SCREENSHOTS=true

  const options:TGobletTestOpts = {
    reusePage: ENVS.GOBLET_PAGE_REUSE,
    reuseContext: ENVS.GOBLET_CONTEXT_REUSE,
    saveTrace: artifactSaveOption(ENVS.GOBLET_TEST_TRACING),
    saveReport: artifactSaveOption(ENVS.GOBLET_TEST_REPORT),
    saveScreenshot: artifactSaveOption(ENVS.GOBLET_TEST_SCREENSHOT),
    // Only chromium can record video so only turn it on for that browser
    // Should be able to record on others, but not currently working
    saveVideo: CanRecordVideo.includes(browserOpts.type as EBrowserName) &&
      artifactSaveOption(ENVS.GOBLET_TEST_VIDEO_RECORD),
  }

  if(ENVS.GOBLET_TEST_TYPE) options.testType = ENVS.GOBLET_TEST_TYPE

  if(artifactSaveActive(ENVS.GOBLET_TEST_TRACING))
    options.tracing = {
      snapshots: toBool(ENVS.GOBLET_TEST_TRACING_SNAPSHOTS),
      screenshots: toBool(ENVS.GOBLET_TEST_TRACING_SCREENSHOTS),
    }

  buildArtifactsPaths(config, options)

  return options
}

