 import type { TExamEvt, TLocEvtData } from "@gobletqa/exam"
import type { TRmCB } from '@GTU/Exam/reporters/event/EventReporter'
import type {
  ETestType,
  TBrowserPage,
  TGobletTestOpts,
  TGobletTestStatus,
  TGobletGlobalRecordVideo,
  TGobletTestArtifactOption,
} from '@GTU/Types'

import path from 'node:path'
import { Logger } from '@gobletqa/logger'
import { get } from '@keg-hub/jsutils/get'
import { wait } from '@keg-hub/jsutils/wait'
import { pathExists } from '@GTU/Utils/fileSys'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { ArtifactSaveOpts } from '@gobletqa/browser'
import { ExamEvtNames } from '@gobletqa/environment/constants'
import { shouldSaveArtifact } from '@GTU/Utils/artifactSaveOption'
import { evtReporter } from '@GTU/Exam/reporters/event/EventReporter'
import {
  getGeneratedName,
  copyArtifactToRepo,
  ensureRepoArtifactDir,
} from '@GTU/Playwright/generatedArtifacts'


export class VideoRecorder {

  disabled?:boolean
  page:TBrowserPage
  evtHandlers:TRmCB[] = []

  name?:string
  saveDir?:string
  recordPath?:string

  constructor(page?:TBrowserPage){
    this.disabled = Boolean(!get(global, `__goblet.context.options.recordVideo`))
    if(this.disabled) return this

    this.page = page || global.page
    this.register()
  }
  
  /**
   * Initializes tracing on the Browser context object
   *
   * @returns {Void}
   */
  register = (
    page:TBrowserPage=this.page || global.page
  ) => {
    if(this.disabled) return
    if(page && !this.page) this.page = page

    if(this.evtHandlers.length){
      Logger.warn(`VideoRecorder event handlers have already been registered`)
      return
    }

    this.evtHandlers.push(evtReporter.on(
      ExamEvtNames.rootSuiteDone,
      async (evt:TExamEvt<TLocEvtData>) => await this.saveVideo(evt, this.page)
    ))

  }


/**
 * Checks if the context was recording a video
 * Then updates the testMeta with the path to the video
 * @param {string} testStatus - passed || failed
 * @param {string|boolean} saveVideo - one of `never` | `always` | `on-fail` | true | false
 *
 * @returns {boolean} - True if the video should be saved
 */
  shouldSave = (
    testStatus:TGobletTestStatus,
    saveVideo:TGobletTestArtifactOption,
    recordDir:string
  ) => {
    if(this.disabled) return false

    if(!saveVideo || saveVideo === ArtifactSaveOpts.never || !recordDir) return false

    return (saveVideo === ArtifactSaveOpts.always) ||
        (testStatus === ArtifactSaveOpts.failed && saveVideo === ArtifactSaveOpts.failed)
  }


  /**
   * Uses the passed in Playwright page to get the video path from
   * Then check if the path exists, and returns
   * If no file found, then calls its self recursively 3 until it does
   * If no page is passed it searches the record directory for the most recent recording
   * @param {string} videoPath - Path to where the videos are recorded
   * @param {number} checks - Path to where the videos are recorded
   * @param {Object} page - Playwright page to get the video path from
   *
   * @returns {Promise<string>} - Location of the most recently saved video recording
   */
  pathFromPage = async (
    videoPath?:string,
    checks:number=0,
    page?:TBrowserPage,
  ) => {
    if(this.disabled) return false

    if(page && !this.page) this.page = page

    // If no video path, this is the first call to the method
    if(!videoPath){
      const video =  this.page.video()
      videoPath = video && await video.path()
    }

    // If still no video path after pull from page, then return
    // Should only happen on the first call
    if(!videoPath) return

    // Ensure the path exists
    // It takes a bit for the video to be created even when we have the path
    // So we have to validate it exist
    const [existsErr, videoExists] = await pathExists(videoPath)
    // If the video exists, we can now return the path
    if(videoPath && videoExists) return videoPath

    // Limit the amount of recursive calls to avoid un-forseen forever loops
    if(checks >= 2) return

    // Wait for half a second and try again
    await wait(500)

    return this.pathFromPage(videoPath, checks++)
  }

  /**
   * Checks if the page was recording a video
   * Then updates the testMeta with the path to the video
   * @param {Object} page - Playwright page to get the video path from
   *
   */
  saveVideo = async (
    evt?:TExamEvt<TLocEvtData>,
    page:TBrowserPage=this.page || global.page
  ) => {
    if(this.disabled) return false

    if(page && !this.page) this.page = page

    if(!evt.data)
      return Logger.warn(`Can not chunk tracing, missing event data`)

    const { location, status, timestamp } = evt.data

    const recordVideo = get<TGobletGlobalRecordVideo>(
      global,
      `__goblet.context.options.recordVideo`,
    )
    
    if(!recordVideo){
      Logger.warn(`Can not save video recording because the recording option was not enabled`)
      return false
    }

    const {
      saveVideo,
      videosDir:repoVideoDir
    } = get<TGobletTestOpts>(
      global,
      `__goblet.options`,
      emptyObj as TGobletTestOpts
    )

    if(!recordVideo.dir || !shouldSaveArtifact(saveVideo, status)) return

    const {
      dir,
      name,
      testLoc,
      nameTimestamp,
    } = getGeneratedName({ location, timestamp })

    if(!testLoc) return false

    this.recordPath = await this.pathFromPage(undefined, 0, this.page)
    this.name = nameTimestamp

    if(!this.recordPath)
      return Logger.warn(
        `The video record path for test ${name} does not exist in directory ${recordVideo.dir}`
      )

    this.saveDir = await ensureRepoArtifactDir(repoVideoDir, dir)

    return path.join(this.saveDir, this.name)
  }

  copyToRepo = async () => {
    if(this.disabled || !this.saveDir || !this.name || !this.recordPath)
      return

    await copyArtifactToRepo(this.saveDir, this.name, this.recordPath)
    Logger.info(`Video Recording saved for failed test`)
  }

  clean = () => {
    if(this.disabled) return
    
    try { this.evtHandlers.forEach(cb => cb?.()) }
    catch(err){}
    this.evtHandlers = []

    this.page = undefined
    this.name = undefined
    this.saveDir = undefined
    this.recordPath = undefined
  }
}
