 import type {
  TExamEvt,
  TLocEvtData,
  TExamConfig,
  IExamReporter,
  TExReporterCfg,
  TEXInterReporterContext,
} from "@gobletqa/exam"
import path from 'path'
import { generateHtml } from './generateHtml'

export class HtmlReporter implements IExamReporter {
  rootDir:string
  reportsDir:string
  reportsTempDir:string

  constructor(
    examCfg:TExamConfig,
    cfg:TExReporterCfg,
  ) {

    const gobletCfg = examCfg?.globals?.__goblet?.config
    this.rootDir = examCfg.rootDir
    this.reportsDir = gobletCfg?.paths?.reportsDir
    this.reportsTempDir = gobletCfg?.internalPaths?.reportsTempDir

  }

  onRunResult = (evt:TExamEvt<TLocEvtData>) => {
    const name = path.basename(evt.data.location).split(`.`).slice(0, -1).join(`.`)
    const location = path.join(this.reportsTempDir, `${name}.html`)
    generateHtml(evt, { location })
  }

  onCancel = (evt:any) => {}

  cleanup = () => {}

}

export default HtmlReporter

