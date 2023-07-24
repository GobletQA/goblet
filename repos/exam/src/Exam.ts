import type {
  TExData,
  TExamEvt,
  TExamConfig,
  TExamEventCB,
  TExamCancelCB,
  TExamCleanupCB,
  TExamStartOpts,
} from '@GEX/types'


import { Loader } from '@GEX/Loader'
import { Execute } from '@GEX/Execute'
import { checkCall } from '@keg-hub/jsutils'
import { ExamEvtNames } from '@GEX/constants'
import { buildExecCfg } from '@GEX/utils/buildExecCfg'
import { ExamEvents, addCustomEvents } from '@GEX/Events'

/**
 * @type Exam
 */
export class Exam {

  // Cache the config, so we can init executor lazily
  #config:TExamConfig

  loader:Loader
  execute:Execute
  id:string = null
  canceled:boolean=false
  onEvents:TExamEventCB[] = []
  onCancel?:TExamCancelCB
  onCleanup?:TExamCleanupCB

  static isRunning:boolean = false

  constructor(config:TExamConfig, id:string) {
    this.id = id
    this.loader = new Loader(this, config)
    this.#config = config
    this.#setEvents(config)
  }


  #setEvents = (config:Pick<TExamConfig, `onEvent`|`onCancel`|`onCleanup`|`events`>) => {
    const {
      events,
      onEvent,
      onCancel,
      onCleanup,
    } = config

    if(onEvent) this.onEvents.push(onEvent)
    if(onCancel) this.onCancel = onCancel
    if(onCleanup) this.onCleanup = onCleanup

    events && addCustomEvents(events)
  }

  /**
   * Loops the registered event methods and calls each one passing in the event object
   * Ensures the current recording state is added and upto date
   * @member {Exam}
   */
  event = (evt:TExamEvt) => {
    if(this.canceled) return this

    this.onEvents.map(func => checkCall(func, {
      ...evt,
      isRunning: Exam.isRunning,
    }))

    return this
  }

  /**
   * Initializes the Executor
   * This is done lazily due to it being async
   * @member {Exam}
   */
  initExec = async (force?:boolean) => {
    if(this.execute){
      if(!force) return this.execute
      await this.execute.cleanup()
    }

    const execCfg = await buildExecCfg({
      exam: this,
      config: this.#config,
    })
    this.execute = new Execute(execCfg)
  }

  /**
   * Starts recording dom events by injecting scripts browser context
   * @member {Exam}
   */
  start = async <
  T extends TExData=TExData
  >(opts:TExamStartOpts<T>) => {
    try {
  
      await this.initExec()
  
      if(Exam.isRunning){
        this.event(ExamEvents.alreadyPlaying)
        return this
      }

      Exam.isRunning = true
      this.#setEvents(opts)

      // TODO: ensure these are set on opts passed to execute.exec
      // content?:string|Ast
      // file?:TExFileModel<Ast>
      // type?:TExFileModel[`fileType`]|string
      
      const results = await this.execute.exec<T>(opts)

      !this.canceled
        && this.event(ExamEvents.results({ data: results }))

    }
    catch(err){
      if(!this.canceled){
        console.error(err.stack)
        this.event(
          ExamEvents.dynamic({
            message: err.message,
            name: ExamEvtNames.error,
          })
        )
      }
    }
    finally {
      !this.canceled && await this.stop()

      return this
    }

  }

  /**
   * Stops recording dom events by removing the current page and creating a new one
   * @member {Exam}
   */
  stop = async () => {
    try {
      if(!Exam.isRunning)
        this.event(ExamEvents.stopped)

      Exam.isRunning = false

      this.event(ExamEvents.ended)
    }
    catch(err){
      console.error(err.stack)

      this.event(
        ExamEvents.dynamic({
          message: err.message,
          name: ExamEvtNames.error,
        })
      )
    }
    finally {
      await this.cleanUp()
    }

    return this
  }

  cancel = async () => {
    this.event(ExamEvents.canceled)

    // TODO: Fix this once runners are setup
    await this.execute?.cancel?.()

    this.canceled = true
    await this.stop()

    return this
  }

  /**
   * Helper method to clean up when recording is stopped
   * Attempts to avoid memory leaks by un setting Recorder instance properties
   */
  cleanUp = async () => {
    try {
      await this.onCleanup?.(this)
    }
    catch(err){
      console.error(err)
      this.event(ExamEvents.dynamic({
        message: err.message,
        name: ExamEvtNames.error,
      }))
    }

    this.onEvents = []
    Exam.isRunning = false
  }
}