 import type {
  TExamEvt,
  TExamConfig,
  TExEventData,
  IExamReporter,
  TExReporterCfg,
  TEXInterReporterContext,
} from "@gobletqa/exam"


export class HtmlReporter implements IExamReporter {
  config:TExamConfig
  testPath?:string

  constructor(
    examCfg:TExamConfig,
    cfg:TExReporterCfg,
    reporterContext?:TEXInterReporterContext
  ) {
    this.config = examCfg
  }

  // Event `PLAY-STARTED`,
  onRunStart = (evt:TExamEvt<TExEventData>) => {
    this.testPath = evt?.data?.testPath
  }

  // Event `PLAY-SUITE-START-ROOT`
  onTestFileStart = (evt:TExamEvt<TExEventData>) => {
    if(this.testPath){
      const rootDir = this.config?.rootDir
      this.testPath = undefined
    }
  }

  onTestStart = (evt:TExamEvt<TExEventData>) => {}


  onTestCaseStart = (evt:TExamEvt<TExEventData>) => {}


  onTestCaseResult = (evt:TExamEvt<TExEventData>) => {}


  onTestResult = (evt:TExamEvt<TExEventData>) => {}


  onTestFileResult = (evt:TExamEvt<TExEventData>) => {}


  onRunComplete = () => {}

  onWarning = (evt:any) => {}

  onError = (evt:any) => {}

  getLastError = () => {

  }


  onCancel = (evt:any) => {}

  cleanup = () => {
    
  }

}

export default HtmlReporter

