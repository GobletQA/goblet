import {
// @ts-ignore
  SUB_REPOS,
  // @ts-ignore
  GOBLET_ROOT,
  // @ts-ignore
  GOBLET_PW_METADATA_DIR,
}  from '@gobletqa/configs/paths.config'

import { deepFreeze } from '@keg-hub/jsutils/deepFreeze'

export const InternalPaths = deepFreeze({
  gobletRoot: GOBLET_ROOT,
  pwMetaDataDir: GOBLET_PW_METADATA_DIR,
  testifyDir: SUB_REPOS.TESTIFY_PATH,
  screencastDir: SUB_REPOS.SCREENCAST_PATH,

  // TODO: move default step defs to their own repo
  // then update this based on the environment and repo location
  defaultStepsDir: `${SUB_REPOS.TESTIFY_PATH}/src/steps`,

  // Temp directories for saving test artifacts
  // These paths should not be saved with the repo
  // They are only used when running tests, then discarded
  appTempDir: `${GOBLET_ROOT}/temp`,
  userDataTempDir: `${GOBLET_ROOT}/temp/user`,
  tracesTempDir: `${GOBLET_ROOT}/temp/traces`,
  videosTempDir: `${GOBLET_ROOT}/temp/videos`,
  downloadsTempDir: `${GOBLET_ROOT}/temp/downloads`,
  snapshotsTempDir: `${GOBLET_ROOT}/temp/snapshots`,
  reportsTempDir: `${GOBLET_ROOT}/temp/reports`,
  reportsTempFile: `${GOBLET_ROOT}/temp/reports/html-report.html`,
})