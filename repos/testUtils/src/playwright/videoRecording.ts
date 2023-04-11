
import {
  TBrowserPage,
  TGobletTestOpts,
  TGobletGlobalRecordVideo,
  TGobletGlobalBrowserOpts,
  TGobletTestArtifactOption,
} from '@GTU/Types'

import fs from 'fs'
import { fileSys, Logger } from '@keg-hub/cli-utils'
import { noOpObj, get, wait } from '@keg-hub/jsutils'
import { appendToLatest } from '@GTU/TestMeta/testMeta'
import { getTestResult } from '@GTU/Reports/jasmineReporter'
import { ARTIFACT_SAVE_OPTS } from '@gobletqa/shared/constants'
import {
  getGeneratedName,
  copyArtifactToRepo,
  ensureRepoArtifactDir,
} from '@GTU/Playwright/generatedArtifacts'

type TTestStatus = `passed` | `failed`

const { getFolderContent, pathExists } = fileSys

/**
 * Uses the passed in Playwright page to get the video path
 * Then check if the path exists, and returns
 * If no file found, then calls its self recursively 3 until it does
 */
const pathFromPageVideo = async (
  page:TBrowserPage,
  videoPath?:string,
  checks:number=0
) => {

  // If no video path, this is the first call to the method
  if(!videoPath){
    const video =  page.video()
    videoPath = video && await video.path()
  }

  // If still no video path after pull from page, then return
  // Should only happen on the first call
  if(!videoPath) return

  // Ensure the path exists
  // It takes a bit for the video to be created even when we have the path
  // So we have to validate it exist
  const videoExists = await pathExists(videoPath)
  // If the video exists, we can now return the path
  if(videoPath && videoExists) return videoPath

  // Limit the amount of recursive calls to avoid un-forseen forever loops
  if(checks >= 2) return

  // Wait for half a second and try again
  await wait(500)

  return pathFromPageVideo(page, videoPath, checks++)
}

/**
 * Uses the passed in Playwright page to get the video path from
 * If no page is passed it searches the record directory for the most recent recording
 * @param {Object} page - Playwright page to get the video path from
 * @param {string} recordDir - Path to where the videos are recorded
 *
 * @returns {string} - Location of the most recently saved video recording
 */
const getRecordingPath = async (
  page:TBrowserPage,
  recordDir:string
) => {
  if(page){
    const videoPath = await pathFromPageVideo(page)
    if(videoPath) return videoPath
  }

  // If no video path, try to find the most recent file
  // Looks at the create time for all file in the record folder
  const files = await getFolderContent(recordDir, {
    full: true,
    exclude: [],
    recursive: false,
  })

  return files.map(file => ({ file, ctimeMs: fs.statSync(file).ctimeMs }))
    .sort((a, b) => a.ctimeMs - b.ctimeMs)
    .pop()
    .file
}


// TODO: Update to use this method, and remove shouldSaveVideo method
// const { shouldSaveArtifact } = require('@gobletqa/shared/utils/artifactSaveOption')
/**
 * Checks if the context was recording a video
 * Then updates the testMeta with the path to the video
 * @param {string} testStatus - passed || failed
 * @param {string|boolean} saveVideo - one of `never` | `always` | `on-fail` | true | false
 *
 * @returns {boolean} - True if the video should be saved
 */
const shouldSaveVideo = (
  testStatus:TTestStatus,
  saveVideo:TGobletTestArtifactOption,
  recordDir:string
) => {
  if(!saveVideo || saveVideo === ARTIFACT_SAVE_OPTS.never || !recordDir) return false

  return (saveVideo === ARTIFACT_SAVE_OPTS.always) ||
      (testStatus === ARTIFACT_SAVE_OPTS.failed && saveVideo === ARTIFACT_SAVE_OPTS.failed)
}

/**
 * Checks if the context was recording a video
 * Then updates the testMeta with the path to the video
 * @param {Object} page - Playwright page to get the video path from
 *
 */
export const saveRecordingPath = async (page:TBrowserPage) => {

  const recordVideo = get<TGobletGlobalRecordVideo>(
    global,
    `__goblet.context.options.recordVideo`,
    noOpObj as TGobletGlobalRecordVideo
  )
 
  const { type:browser=`browser` } = get<TGobletGlobalBrowserOpts>(
    global,
    `__goblet.browser.options`,
    noOpObj as TGobletGlobalBrowserOpts
  )

  const {
    saveVideo,
    testType,
    videosDir:repoVideoDir
  } = get<TGobletTestOpts>(
    global,
    `__goblet.options`,
    noOpObj as TGobletTestOpts
  )

  const {
    name,
    dir,
    nameTimestamp,
    testPath
  } = getGeneratedName()

  // Get the test result, which contains the passed/failed status of the test
  // If failed, then copy over video from temp video dir, to repoVideoDir
  // By default video will not be saved
  const testResult = getTestResult(testPath)
  const saveTestVideo = shouldSaveVideo(
    testResult?.status,
    saveVideo,
    recordVideo.dir
  )

  if(!saveTestVideo) return

  // TODO: update to use video.saveAs(path)
  const recordPath = await getRecordingPath(page, recordVideo.dir)
  if(!recordPath)
    return Logger.warn(
      `The video record path for test ${name} does not exist in directory ${recordVideo.dir}`
    )

  const saveDir = await ensureRepoArtifactDir(repoVideoDir, dir)
  const savePath = await copyArtifactToRepo(saveDir, nameTimestamp, recordPath)

  testType &&
    await appendToLatest(`${testType}.recordings.${browser}.${name}`, {
      ...recordVideo,
      path: savePath,
    }, true)
}

