import type { TGobletTestArtifactOption } from '@GTU/Types'
 import {
  TExamEvt,
  TRunResult,
  TLocEvtData,
  TExamConfig,
  IExamReporter,
  TExReporterCfg,
  TEXInterReporterContext,
} from "@gobletqa/exam"

import path from 'path'
import { writeFile } from 'fs/promises'
import { Logger } from "@gobletqa/logger"
import { ImgHtml } from './generator/ImgHtml'
import { HeadHtml } from './generator/HeadHtml'
import { BodyHtml } from './generator/BodyHtml'
import { takeScreenshot } from './takeScreenshot'
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
  data:TLocEvtData
}

export type TTestTimeCache = {
  start:number
  end?:number
  length?:number|string
}

export type TReporterOpts = {
  testTimes:Record<string, TTestTimeCache>
  onRenderTest?: (data:TRunResult) => string
  onRenderError?: (data:TRunResult) => string
}



const buildTitle = (response:TLocEvtData, reportTitle?:string) => {
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

export class HtmlReporter implements IExamReporter {

  #page?:any
  rootDir:string
  reportsDir:string
  disabled?:boolean
  #screenshotExt?:string
  #testTimeout?:number
  #suiteTimeout?:number
  #screenshots: Record<string, string>={}
  #saveReport?:TGobletTestArtifactOption
  #saveScreenshot?:TGobletTestArtifactOption
  #testTimes:Record<string, TTestTimeCache> = {}

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

    const gobletCfg = examCfg?.globals?.__goblet?.config
    this.rootDir = examCfg.rootDir
    this.#testTimeout = examCfg.testTimeout
    this.#suiteTimeout = examCfg.suiteTimeout
    const workDir = gobletCfg?.paths?.workDir
    const reportsDir = gobletCfg?.paths?.reportsDir

    this.reportsDir = workDir
      ? path.join(this.rootDir, workDir, reportsDir)
      : path.join(this.rootDir, reportsDir)

    this.#screenshotExt = cfg?.screenshotExt || `png`
    this.#saveScreenshot = cfg?.saveScreenshot || false

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

  #getPage = () => {
    if(!this.#saveScreenshot) return
    this.#page = this.#page || global.getLastActivePage?.() || global?.page
    !this.#page
      && console.warn(`Html Reporter "saveScreenshot" is "true", but a Browser Page does not exist`)

    return this.#page
  }

  #renderImg = (data:TRunResult) => {
    const uri = this.#screenshots[data.id]
    return uri
      ? ImgHtml({
          uri,
          alt: data?.fullName,
          ext: this.#screenshotExt,
          className: `html-render-screenshot`,
        })
      : ``
  }

  #onRenderTest = (data:TRunResult) => {
    return data.failed && (this.#saveScreenshot === ArtifactSaveOpts.failed)
      ? ``
      : this.#renderImg(data)
  }

  #htmlTemplate = ({
    data,
    title,
    date=new Date().toLocaleString(),
  }:THtmlTemplate) => {
    const built = buildTitle(data, title)
    const totalTime = getTestLength(
      { start: data?.stats?.runStart, end: data?.stats?.runEnd,  },
      this.#suiteTimeout
    )

    return `
      <!DOCTYPE html>
      <html>
        ${HeadHtml(data, built)}
        ${BodyHtml({
          data,
          date,
          totalTime,
          title:built,
          testTimes: this.#testTimes,
          onRenderError: this.#renderImg.bind(this),
          onRenderTest: this.#onRenderTest.bind(this),
        })}
      </html>
    `
  }

  #saveFile = async (evt:TExamEvt<TLocEvtData>, html:string) => {
    try {
      const { location, timestamp } = evt.data
      const { dir, nameTimestamp } = getGeneratedName({ location, timestamp })
      const saveDir = await ensureRepoArtifactDir(this.reportsDir, dir)
      const reportLoc = path.join(saveDir, `${nameTimestamp}.html`)

      await writeFile(reportLoc, html)
      Logger.info(`Html Report saved for failed test`)
    }
    catch(err){
      Logger.error(`Error saving html report to`, `${this.reportsDir.replace(this.rootDir, ``)}`)
      Logger.log(err.stack)
    }
  }

  onTestStart = (evt:TExamEvt<TLocEvtData>) => {
    const { id, timestamp } = evt?.data
    this.#testTimes[id] = {start: timestamp}
  }

  onTestResult = async (evt:TExamEvt<TLocEvtData>) => {
    const { id, timestamp, status } = evt?.data

    if(this.#testTimes[id]){
      this.#testTimes[id].end = timestamp
      const length = getTestLength(this.#testTimes[id], this.#testTimeout)
      length && (this.#testTimes[id].length = length)
    }

    if(!shouldSaveArtifact(this.#saveScreenshot, status)) return

    const page = this.#getPage()
    if(!page) return

    const resp = await takeScreenshot(evt, { ext: this.#screenshotExt, page })
    resp && (this.#screenshots[resp.id] = resp.uri)
  }

  onRunResult = async (evt:TExamEvt<TLocEvtData>) => {
    const { status } = evt?.data
    if(!shouldSaveArtifact(this.#saveReport, status)) return

    const html = this.#htmlTemplate({ data: evt.data })
    await this.#saveFile(evt, html)
    this.#testTimes = {}
  }

}

export default HtmlReporter

