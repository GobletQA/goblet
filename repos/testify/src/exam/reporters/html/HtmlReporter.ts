import type { TBuiltStats } from './utils/getStats'
import type { TGobletTestArtifactOption } from '@GTU/Types'
 import {
  TExamEvt,
  TExEventData,
  TExamConfig,
  IExamReporter,
  TExReporterCfg,
  TEXInterReporterContext,
} from "@gobletqa/exam"

import path from 'path'
import { writeFile } from 'fs/promises'
import { Logger } from "@gobletqa/logger"
import { getStats } from './utils/getStats'
import { ENVS } from '@gobletqa/environment'
import { ImgHtml } from './generator/ImgHtml'
import { HeadHtml } from './generator/HeadHtml'
import { BodyHtml } from './generator/BodyHtml'
import { takeScreenshot } from './takeScreenshot'
import { PartialsHtml } from './generator/PartialsHtml'
import { getPage } from '@GTU/Playwright/browserContext'
import { shouldSaveArtifact } from '@GTU/Utils/artifactSaveOption'
import { ArtifactSaveOpts } from '@gobletqa/environment/constants'
import {
  getGeneratedName,
  ensureRepoArtifactDir,
} from '@GTU/Playwright/generatedArtifacts'

export type TGenHtmlOpts = {
  debug?:boolean
  location?:string
}

export type THtmlTemplate = {
  date?:string
  title?:string
  data:TExEventData
}

export type TTestTimeCache = {
  start:number
  end?:number
  length?:number|string
}

export type TReporterOpts = {
  location:string
  testTimes:Record<string, TTestTimeCache>
  onRenderTest?: (data:TExEventData, opts:TReporterOpts) => string
  onRenderError?: (data:TExEventData, opts:TReporterOpts) => string
}

export type THtmlPartials = Record<string, { html:string, stats:TBuiltStats }>


const buildTitle = (response:TExEventData, reportTitle?:string) => {
  if(reportTitle) return reportTitle

  if(response.location)
    return response.location.split(`/`)
      .pop()
      .split('.')
      .shift()
      .trim()
      .replace(/[-_]/g, ' ')

  const description = response?.describes?.[0]?.description
  if(!description) return `Goblet Test Report`

  return description.includes(`>`)
    ? description.split(`>`).pop().trim()
    : description.trim().replace(/^feature/gi, ``)
}

const validate = (examCfg:TExamConfig) => {
  if(!examCfg?.globals?.__goblet?.config)
    throw new Error(`HTML Reporter can not run. Missing Goblet Config!`)

  if(!examCfg.rootDir)
    throw new Error(`HTML Reporter can not run. Missing Exam Config - root directory!`)

  if(!examCfg?.globals?.__goblet?.config?.paths?.reportsDir)
    throw new Error(`HTML Reporter can not run. Missing Goblet Config - reports directory!`)
}

const getTestLength = ({start, end}:TTestTimeCache, testTimeout:number) => {
  if(!start || !end) return

  const time = Math.abs(end - start)
  const length = time > testTimeout ? testTimeout : time

  return (length / 1000).toFixed(2)
}

const wrapHtml = (head:string, body:string) => {
  return `<!DOCTYPE html><html>${head}${body}</html>`
}

export class HtmlReporter implements IExamReporter {

  rootDir:string
  reportsDir:string
  disabled?:boolean
  #screenshotExt?:string
  #testTimeout?:number
  #suiteTimeout?:number
  #saveReport?:TGobletTestArtifactOption
  #saveScreenshot?:TGobletTestArtifactOption
  #testTimes:Record<string, TTestTimeCache> = {}
  #partialTestTimes:TTestTimeCache = { start: 0, end: 0 }
  #screenshots: Record<string, Record<string, string>>={}

  #title?:string
  #logSplit?:string=``
  #combineAllTests?:boolean
  #htmlPartials:THtmlPartials={}
  #logScreenshots?:boolean=false

  constructor(
    examCfg:TExamConfig,
    cfg?:TExReporterCfg,
    reporterContext?:TEXInterReporterContext
  ) {

    this.#saveReport = cfg?.saveReport || false

    if(!this.#saveReport){
      this.#disable()
      return this
    }

    validate(examCfg)

    this.rootDir = examCfg.rootDir
    this.#testTimeout = examCfg.testTimeout
    this.#suiteTimeout = examCfg.suiteTimeout

    const gobletCfg = examCfg?.globals?.__goblet?.config
    const workDir = gobletCfg?.paths?.workDir
    const reportsDir = gobletCfg?.paths?.reportsDir

    this.reportsDir = cfg?.reportsDir
      ? cfg.reportsDir
      : workDir
        ? path.join(this.rootDir, workDir, reportsDir)
        : path.join(this.rootDir, reportsDir)

    this.#screenshotExt = cfg?.screenshotExt || `png`
    this.#saveScreenshot = cfg?.saveScreenshot || false
    this.#combineAllTests = cfg?.combineAllTests || false
    this.#title = cfg?.reportTitle || gobletCfg?.$ref || `Goblet Test Report`

    if(cfg.logScreenshots){
      this.#logScreenshots = cfg.logScreenshots
      this.#logSplit = cfg?.logSplit || ENVS.EXAM_EVENT_LOG_SPLIT_KEY
    }

  }

  /**
   * TODO: This is a hack to log screenshots event in a way that screencast child_process can pick them up
   * Screenshots should be updated to work the same as trace and video reports
   * Once done this can be removed
   */
  #logScreenshot = (resp:{id?:string|number, uri?:string}, location:string) => {
    Logger.stdout(`${this.#logSplit}${JSON.stringify({
      location,
      metaData:{},
      error: false,
      type: `test`,
      action: `screenshot`,
      name:`SCREENSHOT`,
      data:{...resp, location}
    })}${this.#logSplit}`)
  }

  /**
   * This effectively disables the reporter by removing the event listener methods
   * This way we can ensure the report is never generated when it's disabled
   */
  #disable = () => {
    this.disabled = true
    this.onTestStart = undefined
    this.onTestResult = undefined
    this.onRunResult = undefined
  }

  #renderImg = (data:TExEventData, opts:TReporterOpts) => {
    const location = data?.location || opts?.location
    if(!location || !data?.id) return ``

    const uri = this.#screenshots?.[location]?.[data.id]
    return uri
      ? ImgHtml({
          uri,
          alt: data?.fullName,
          ext: this.#screenshotExt,
          className: `html-render-screenshot`,
        })
      : ``
  }

  #onRenderTest = (data:TExEventData, opts:TReporterOpts) => {
    return data.failed && (this.#saveScreenshot === ArtifactSaveOpts.failed)
      ? ``
      : this.#renderImg(data, opts)
  }

  #htmlTemplate = ({
    data,
    title:fileTitle,
    date=new Date().toLocaleString(),
  }:THtmlTemplate) => {
    const title = buildTitle(data, fileTitle)
    const totalTime = getTestLength(
      { start: data?.stats?.runStart, end: data?.stats?.runEnd, },
      this.#suiteTimeout
    )

    if(data?.stats?.runEnd) this.#partialTestTimes.end = data?.stats?.runEnd
    if(!this.#partialTestTimes.start) this.#partialTestTimes.start = data?.stats?.runStart

    const stats = getStats(data)
    const bodyHtml = BodyHtml({
      data,
      date,
      title,
      stats,
      totalTime,
      location: data.location,
      testTimes: this.#testTimes,
      combineTests: this.#combineAllTests,
      onRenderError: this.#renderImg.bind(this),
      onRenderTest: this.#onRenderTest.bind(this),
    })

    return this.#combineAllTests
      ? { html: bodyHtml, stats }
      : { html: wrapHtml(HeadHtml(title, this.#combineAllTests), bodyHtml), stats }
  }

  #saveFile = async (evt:TExamEvt<TExEventData>, html:string) => {
    try {
      const { location, timestamp } = evt.data
      const { dir, nameTimestamp } = getGeneratedName({ location, timestamp })
      const saveDir = await ensureRepoArtifactDir(this.reportsDir, dir)
      const reportLoc = path.join(saveDir, `${nameTimestamp}.html`)
      const relativeLoc = reportLoc.replace(this.rootDir, ``)

      await writeFile(reportLoc, html)
      Logger.log(Logger.colors.gray(` - Html Report saved to "${relativeLoc}"`))
    }
    catch(err){
      Logger.error(`Error saving html report to`, `${this.reportsDir.replace(this.rootDir, ``)}`)
      Logger.log(err.stack)
    }
  }

  onTestStart = (evt:TExamEvt<TExEventData>) => {
    const { id, timestamp } = evt?.data
    this.#testTimes[id] = {start: timestamp}
  }

  onTestResult = async (evt:TExamEvt<TExEventData>) => {
    try {
      const { id, timestamp, status, location } = evt?.data

      if(this.#testTimes[id]){
        this.#testTimes[id].end = timestamp
        const length = getTestLength(this.#testTimes[id], this.#testTimeout)
        length && (this.#testTimes[id].length = length)
      }

      if(!shouldSaveArtifact(this.#saveScreenshot, status)) return

      const page = await getPage()
      if(!page) return
      const resp = await takeScreenshot(evt, { ext: this.#screenshotExt, page })
      if(!resp) return

      this.#screenshots[location] = this.#screenshots[location] || {}
      this.#screenshots[location][resp.id] = resp.uri

      this.#logScreenshots
        && this.#logScreenshot(resp, location)
    }
    catch(err){
      console.error(err)
    }
  }

  onFinished = async (evt:TExamEvt<TExEventData>) => {
    if(!this.#combineAllTests) return

    const totalTime = getTestLength(this.#partialTestTimes, this.#suiteTimeout)

    const bodyHtml = PartialsHtml({
      totalTime,
      title: this.#title,
      partials: this.#htmlPartials,
      date: new Date().toLocaleString(),
    })

    const html = wrapHtml(HeadHtml(this.#title, this.#combineAllTests), bodyHtml)
    await this.#saveFile(evt, html)

  }


  onRunResult = async (evt:TExamEvt<TExEventData>) => {
    const { status, location } = evt?.data
    if(!shouldSaveArtifact(this.#saveReport, status)) return

    const { html, stats } = this.#htmlTemplate({ data: evt.data })
    if(this.#combineAllTests){
      this.#htmlPartials[location] = { html, stats }
      return
    }

    await this.#saveFile(evt, html)
    this.#testTimes = {}
  }

}

export default HtmlReporter

/**
  PLAY-SPEC-START - onTestStart
  PLAY-SPEC-DONE - onTestResult
  PLAY-FINISHED - onFinished
  PLAY-RESULTS - onRunResult
 */