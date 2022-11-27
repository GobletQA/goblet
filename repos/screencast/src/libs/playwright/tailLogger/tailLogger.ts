import type { TLineFilter, TTailCallbacks, TTailLogger } from '@GSC/types'

import fs from 'fs-extra'
import Tail from 'tail-file'

const defFilter = (line:string) => line

export class TailLogger {

  tail:Tail
  file:string
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
    this.tail.start()
  }

}