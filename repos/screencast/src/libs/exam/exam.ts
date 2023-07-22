import { Exam } from '@gobletqa/exam'

import type { TFeatureAst, TParkinRunStepOptsMap } from '@ltipton/parkin'
import type {
  TRepo,
  TBrowser,
  TPlayerOpts,
  TBrowserPage,
  TPlayerEvent,
  TPlayerConfig,
  TPlayerEventCB,
  TBrowserContext,
  TPlayerCleanupCB,
  TPlayerStartConfig,
} from '@GSC/types'

import { PWPlay } from '@GSC/constants'
import {noOp, checkCall, deepMerge} from '@keg-hub/jsutils'


export const exam = new Exam()


export class RepoExam {
  
  page:TBrowserPage
  
  constructor(config:TPlayerConfig, id:string){
    this.id = id
    this.setupPlayer(config)
  }


  /**
   * Initializes the recorder
   * Ensures only the properties that are passed in are added to the Recorder 
   * @member {Recorder}
   */
  setupPlayer = (config:TPlayerConfig) => {
    const {
      page,
      repo,
      steps,
      context,
      browser,
      options,
      onEvent,
      onCleanup,
    } = config

    if(page) this.page = page
    if(repo) this.repo = repo
    if(steps) this.steps = steps
    if(context) this.context = context
    if(browser) this.browser = browser
    if(options) this.options = deepMerge(this.options, options)

    if(onEvent) this.onEvents.push(onEvent)
    if(onCleanup) this.onCleanup = onCleanup

    return this
  }


  
}