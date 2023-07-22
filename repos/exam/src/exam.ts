import type {
  TExamEvt,
  TExamConfig,
  TExamEventCB,
  TExamOptions,
  TExamCancelCB,
  TExamCleanupCB,
} from '@GEX/types'
import type {
  TPlayerStartConfig,
} from '@gobletqa/shared/types'

import { checkCall, deepMerge } from '@keg-hub/jsutils'
import { ExamEvtNames, ExamEvents } from '@GEX/constants'

/**
 * @type Exam
 */
export class Exam {

  id:string = null
  canceled:boolean=false
  onEvents:TExamEventCB[] = []
  onCancel?:TExamCancelCB
  onCleanup?:TExamCleanupCB
  options:TExamOptions = {} as TExamOptions

  static isRunning:boolean = false

  constructor(config:TExamConfig, id:string) {
    this.id = id
    this.setup(config)
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
   * Initializes the recorder
   * Ensures only the properties that are passed in are added to the Recorder 
   * @member {Exam}
   */
  setup = (config:TExamConfig) => {
    const {
      options,
      onEvent,
      onCancel,
      onCleanup,
    } = config

    if(options) this.options = deepMerge(this.options, options)
    if(onEvent) this.onEvents.push(onEvent)
    if(onCancel) this.onCancel = onCancel
    if(onCleanup) this.onCleanup = onCleanup

    return this
  }

  /**
   * Starts recording dom events by injecting scripts browser context
   * @member {Exam}
   */
  start = async (startCof:TPlayerStartConfig) => {
    const { url, ...config } = startCof

    try {
  
      if(Exam.isRunning){
        this.event(ExamEvents.alreadyPlaying)
        return this
      }

      Exam.isRunning = true
      this.setup(config)
      
      // CALL EXEC here to kick off test run

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
    // await this.runner?.cancel?.()

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

    this.options = {}
    this.onEvents = []
    Exam.isRunning = false
  }
}