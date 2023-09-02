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
import { mkdir, writeFile } from 'fs/promises'
import { ImgHtml } from './generator/ImgHtml'
import { HeadHtml } from './generator/HeadHtml'
import { BodyHtml } from './generator/BodyHtml'
import { takeScreenshot } from './takeScreenshot'
import { shouldSaveArtifact } from '@GTU/Utils/artifactSaveOption'
import { ArtifactSaveOpts } from '@gobletqa/environment/constants'

export type TGenHtmlOpts = {
  debug?:boolean
  location?:string
}

export type THtmlTemplate = {
  date?:string
  title?:string
  data:TLocEvtData
}

export type TReporterOpts = {
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

export class HtmlReporter implements IExamReporter {
  #page?:any
  rootDir:string
  reportsDir:string
  #screenshotExt?:string
  #saveScreenshot?:boolean|string
  #screenshots: Record<string, string>={}

  constructor(
    examCfg:TExamConfig,
    cfg?:TExReporterCfg,
    reporterContext?:TEXInterReporterContext
  ) {

    validate(examCfg)

    const gobletCfg = examCfg?.globals?.__goblet?.config
    this.rootDir = examCfg.rootDir
    const workDir = gobletCfg?.paths?.workDir
    const reportsDir = gobletCfg?.paths?.reportsDir

    this.reportsDir = workDir
      ? path.join(this.rootDir, workDir, reportsDir)
      : path.join(this.rootDir, reportsDir)

    this.#screenshotExt = cfg?.screenshotExt || `png`
    this.#saveScreenshot = cfg?.saveScreenshot || false

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

    return `
      <!DOCTYPE html>
      <html>
        ${HeadHtml(data, built)}
        ${BodyHtml({
          data,
          date,
          title:built,
          onRenderError: this.#renderImg.bind(this),
          onRenderTest: this.#onRenderTest.bind(this),
        })}
      </html>
    `
  }

  #saveReport = async (evt:TExamEvt<TLocEvtData>, html:string) => {
    try {
      await mkdir(this.reportsDir, { recursive: true })
      const timestamp = evt.data.timestamp || new Date().getTime()
      const name = path.basename(evt.data.location).split(`.`).slice(0, -1).join(`.`)
      const location = path.join(this.reportsDir, `${name}-${timestamp}.html`)
      await writeFile(location, html)
      console.log(`  Html report saved to:`, `${location.replace(this.rootDir, ``)}`)
    }
    catch(err){
      console.error(`  Error saving html report to`, `${this.reportsDir.replace(this.rootDir, ``)}`)
      console.log(err.stack)
    }
  }

  onTestResult = async (evt:TExamEvt<TLocEvtData>) => {
    if(!shouldSaveArtifact(this.#saveScreenshot, evt?.data?.status)) return

    const page = this.#getPage()
    if(!page) return
    
    const resp = await takeScreenshot(evt, { ext: this.#screenshotExt, page })
    resp && (this.#screenshots[resp.id] = resp.uri)
  }

  onRunResult = async (evt:TExamEvt<TLocEvtData>) => {
    const html = this.#htmlTemplate({ data: evt.data })
    await this.#saveReport(evt, html)
  }

}

export default HtmlReporter

