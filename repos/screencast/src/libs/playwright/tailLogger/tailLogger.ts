import type { TLineFilter, TTailCallbacks, TTailLogger } from '@GSC/types'

import fs from 'fs-extra'
import Tail from 'tail-file'

const defFilter = (line:string) => line

export class TailLogger {

  tail:Tail
  file:string
  started:boolean
  callbacks:TTailCallbacks
  filter:TLineFilter=defFilter

  constructor(opts:TTailLogger){
    const {
      file,
      start,
      filter,
      create,
      truncate,
      ...callbacks
    } = opts
    
    filter && (this.filter = filter)

    this.file = file
    this.callbacks = callbacks
    create && fs.ensureFileSync(this.file)
    truncate && this.truncate()
    this.tail = new Tail(this.file)

    this.tail.on(`line`, this.onLine)
    this.tail.on(`error`, this.onError)
    this.tail.on(`ready`, this.onReady)

    start && this.start()
  }

  truncate = () => {
    fs.truncateSync(this.file)
  }

  onLine = (line:string) => {
    this?.callbacks?.onLine?.(this.filter?.(line) ?? line)
  }

  onError = (error:Error) => {
    Object.assign(error, {
      stack: this.filter?.(error.stack) ?? error.stack,
      message: this.filter?.(error.message) ?? error.message
    })

    this?.callbacks?.onError?.(error)
  }

  onReady = (fd:Record<any, any>) => {
    this?.callbacks?.onReady?.(fd)
  }
  
  start = () => {
    if(this.started) return

    this.started = true
    console.log(`Starting Playwright log-tail...`)
    this.tail.start()
  }

  stop = async () => {
    this.started = false
    console.log(`Stopping Playwright log-tail...`)

    await this.tail.stop()
    this.callbacks = undefined
  }

}