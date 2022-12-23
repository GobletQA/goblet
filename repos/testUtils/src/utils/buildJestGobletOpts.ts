import type {
  TBrowserConf,
  TGobletConfig,
  TJestGobletOpts,
  TBrowserContextOpts
} from '@GTU/Types'

import path from 'path'
import { toBool } from '@keg-hub/jsutils'
import { ARTIFACT_TYPES } from '@gobletqa/shared/constants'
import { canRecordVideo } from '@gobletqa/screencast/constants'
import { getPathFromBase } from '@gobletqa/shared/utils/getPathFromBase'
import {
  artifactSaveActive,
  artifactSaveOption,
} from '@gobletqa/shared/utils/artifactSaveOption'

/**
 * Builds the repo paths to artifacts generated at test run
 */
const buildArtifactsPaths = (
  config:TGobletConfig,
  options
) => {
  const { artifactsDir } = config.paths
  ARTIFACT_TYPES.map(type => {
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
export const buildJestGobletOpts = (
  config:TGobletConfig,
  browserOpts:TBrowserConf,
  contextOpts:TBrowserContextOpts
) => {
  const {
    GOBLET_TEST_TYPE,
    GOBLET_TEST_REPORT,
    GOBLET_TEST_TRACING,
    GOBLET_TEST_VIDEO_RECORD,
    // TODO: add cli options for these,
    // Currently can be set by ENV only
    GOBLET_TEST_TRACING_SNAPSHOTS=true,
    GOBLET_TEST_TRACING_SCREENSHOTS=true
  } = process.env

  const options:TJestGobletOpts = {
    saveTrace: artifactSaveOption(GOBLET_TEST_TRACING),
    saveReport: artifactSaveOption(GOBLET_TEST_REPORT),
    // Only chromium can record video so only turn it on for that browser
    // Should be able to record on others, but not currently working
    saveVideo: canRecordVideo.includes(browserOpts.type) &&
      artifactSaveOption(GOBLET_TEST_VIDEO_RECORD),
  }

  if(GOBLET_TEST_TYPE) options.testType = GOBLET_TEST_TYPE

  if(artifactSaveActive(GOBLET_TEST_TRACING))
    options.tracing = {
      snapshots: toBool(GOBLET_TEST_TRACING_SNAPSHOTS),
      screenshots: toBool(GOBLET_TEST_TRACING_SCREENSHOTS),
    }

  buildArtifactsPaths(config, options)

  return options
}

