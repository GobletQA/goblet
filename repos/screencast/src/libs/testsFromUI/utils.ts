import type { TUITestEvt, TExamUIChildProcOpts } from '@GSC/types'

import path from 'node:path'
import { EUIReportType } from '@GSC/types'
import { ENVS } from '@gobletqa/environment'
import {
  InternalPaths,
  ArtifactSaveOpts,
  TestsToSocketEvtMap
} from '@gobletqa/environment/constants'

/**
 * Default options when executing a child process
 * @object
 */
export const getDefOpts = ():TExamUIChildProcOpts => ({
  stdio: `pipe`,
  detached: false,
  shell: `/bin/bash`,
  gid: process.getgid(),
  uid: process.getuid(),
  env: {
    /**
     * We have to force disable the safe replacer to ensure we get valid json output
     * This way the passed in callback events can parse the JSON from stdout
     */
    GB_LOGGER_FORCE_DISABLE_SAFE: `1`,
    /**
     * Ensure exam logs any thrown errors as JSON
     */
    EXAM_LOG_ERR_EVENT: `1`,
    /**
     * Ensure the log split key is set to the current environments value
     */
    EXAM_EVENT_LOG_SPLIT_KEY: ENVS.EXAM_EVENT_LOG_SPLIT_KEY,
    /**
     * Disable colors from being logged
     */
    GOBLET_TEST_COLORS: `0`,
    /**
     * Custom options to pass to the html reporter
     */
    GOBLET_TEST_HTML_REPORTER_OPTS: JSON.stringify({
      /**
       * Logs screenshots so then can be picked up in the child_process logs
       */
      // logScreenshots: true,

      /**
       * For saving the HTML report
       */
      saveReport: ArtifactSaveOpts.always,
      /**
       * Save all html reports as a single html file
       */
      combineAllTests: true,
      /**
       * Save the HTML reports to a temp location
       * The UI will allow users to download this file if needed
       */
      reportsDir: InternalPaths.reportsTempDir,
    })
  },
})



export const cleanRepoName = (name:string) => {
  return name.replace(/[!@#$%^&*()_\\=+?:;"'<>,.{}|\/\[\]]/g, ` `)
    .trim()
    .replace(/\s/g, `-`)
    .toLowerCase()
}

export const buildTempLoc = (
  dir:string,
  name:string,
  type:EUIReportType,
) => {
  return path.join(dir, `${name}.${type}`)
}


export const rmRootFromLoc = (loc:string=``, rootDir?:string) => {
  return rootDir ? loc?.replace?.(rootDir, ``) : loc
}

export const getUuid = (evt:TUITestEvt) => {
  const loc = evt?.data?.location || evt?.location

  let name:string|undefined = ``
  if(loc) name = loc.split?.(`/`)?.pop()?.split?.(`.`)?.shift?.() || ``

  const idRef = evt?.data?.id || evt?.data?.testPath || ``
  const type = evt?.data?.type

  return [name, type, idRef].filter(Boolean).join(`-`)

}


export const getText = (evt:TUITestEvt) => {
  if(!evt?.data?.metaData)
    return evt.name === TestsToSocketEvtMap.error
      ? evt?.message || evt?.data?.description || ``
      : evt?.data?.description || evt?.message || ``

  const {
    metaData,
    eventParent
  } = evt.data

  const {
    step,
    rule,
    feature,
    scenario,
    background,
  } = metaData

  const text = evt?.data?.metaData[eventParent as keyof typeof evt.data.metaData]

  return text
    || step
    || rule
    || feature
    || scenario
    || background

}
