 import {
  TExamEvt,
  TLocEvtData,
  TExamConfig,
  IExamReporter,
  TRunResult,
  TExReporterCfg,
  TEXInterReporterContext,
  TestsResultStatus,
} from "@gobletqa/exam"

import path from 'path'
import { HeadHtml } from './parts/HeadHtml'
import { BodyHtml } from './parts/BodyHtml'
import { mkdir, writeFile } from 'fs/promises'

export type TGenHtmlOpts = {
  debug?:boolean
  location?:string
}

export type THtmlTemplate = {
  response:TLocEvtData
  reportTitle?:string
  currentDate?:string
}

export type TReporterOpts = {
  onRenderTest: (result:TRunResult) => string
  onRenderError: (result:TRunResult) => string
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
  reportsDir:string
  rootDir:string

  constructor(
    examCfg:TExamConfig,
    cfg:TExReporterCfg,
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
  }

  #htmlTemplate = ({
    response,
    currentDate=new Date().toLocaleString(),
    reportTitle,
  }:THtmlTemplate) => {
    const title = buildTitle(response, reportTitle)

    return `
      <!DOCTYPE html>
      <html>
        ${HeadHtml(response, title)}
        ${BodyHtml(response, currentDate, title)}
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
      console.log(`  Html report saved to:`, `./${location.replace(this.rootDir, ``)}`)
    }
    catch(err){
      console.error(`  Error saving html report to`, `./${this.reportsDir.replace(this.rootDir, ``)}`)
      console.log(err.stack)
    }
  }

  onTestResult = (evt:TExamEvt<TLocEvtData>) => {

    // if(evt?.data?.status !== TestsResultStatus.passed){
      
    // }
  }

  onRunResult = async (evt:TExamEvt<TLocEvtData>) => {
    const html = this.#htmlTemplate({ response: evt.data })
    await this.#saveReport(evt, html)
  }

}

export default HtmlReporter

