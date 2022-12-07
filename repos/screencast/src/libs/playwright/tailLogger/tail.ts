let events = require(`events`)
let fs = require('fs')
let path = require('path')

// const environment = process.env['NODE_ENV'] || 'development'

class devNull {
    info(...args:any[]) { }
    error(...args:any[]) { }
}

export type TTailOpts = {
  nLines?: number
  separator?:RegExp
  flushAtEOF?: boolean
  useWatchFile?: boolean
  logger?: typeof devNull
  fromBeginning?: boolean
  encoding?:BufferEncoding
  fsWatchOptions?: Record<any, any>
}

const getSep = (separator:RegExp) => {
  return separator !== undefined ? separator : /[\r]{0,1}\n/
}

const fileExists = (filename:string) => {
  try { fs.accessSync(filename, fs.constants.F_OK) }
  catch (err) { if (err.code == 'ENOENT') throw err }
}

export class Tail extends events.EventEmitter {

  logger:devNull
  follow:boolean
  absPath:string
  nLines?:number
  filename:string
  separator:RegExp
  flushAtEOF:boolean
  useWatchFile:boolean
  encoding:BufferEncoding
  rewatchId:NodeJS.Timeout
  fsWatchOptions:Record<any, any>

  constructor(filename:string, options:TTailOpts = {}) {
    super()

    this.filename = filename
    this.absPath = path.dirname(this.filename)
    this.separator = getSep(options.separator)

    this.fsWatchOptions = options.fsWatchOptions || {}
    this.follow = options['follow'] != undefined ? options['follow'] : true
    this.logger = (options.logger || new devNull()) as devNull
    this.useWatchFile = options.useWatchFile || false
    this.flushAtEOF = options.flushAtEOF || false
    this.encoding = options.encoding || 'utf-8'
    const fromBeginning = options.fromBeginning || false
    this.nLines = options.nLines || undefined

    this.logger.info(`Tail starting...`)
    this.logger.info(`filename: ${this.filename}`)
    this.logger.info(`encoding: ${this.encoding}`)

    fileExists(this.filename)

    this.pos = 0
    this.queue = []
    this.buffer = ''
    this.isWatching = false
    this.internalDispatcher = new events.EventEmitter()

    // this.internalDispatcher.on('next',this.readBlock)
    this.internalDispatcher.on('next', () => this.readBlock())

    this.logger.info(`fromBeginning: ${fromBeginning}`)
    let startingCursor

    if (fromBeginning) startingCursor = 0
    else if (this.nLines !== undefined) {
      const data = fs.readFileSync(this.filename, {
        flag: 'r',
        encoding: this.encoding
      })
      const tokens = data.split(this.separator)
      //if the file ends with empty line ignore line NL
      const dropLastToken = (tokens[tokens.length - 1] === '') ? 1 : 0

        //nLines is bigger than avaiable tokens: tail from the begin
      if (tokens.length - this.nLines - dropLastToken <= 0) startingCursor = 0
      else {
        const match = data.match(
          new RegExp(`(?:[^\r\n]*[\r]{0,1}\n){${tokens.length - this.nLines - dropLastToken}}`)
        )
        startingCursor = (match && match.length)
          ? Buffer.byteLength(match[0], this.encoding)
          : this.latestPosition()
      }
    }
    else startingCursor = this.latestPosition()

    if (startingCursor === undefined) throw new Error("Tail can't initialize.")
    const flush = fromBeginning || (this.nLines != undefined)

    try {
      this.watch(startingCursor, flush)
    }
    catch (err) {
      this.logger.error(`watch for ${this.filename} failed: ${err}`)
      this.emit("error", `watch for ${this.filename} failed: ${err}`)
    }

  }

  latestPosition() {
    try {
      return fs.statSync(this.filename).size
    }
    catch (err) {
      this.logger.error(`size check for ${this.filename} failed: ${err}`)
      this.emit("error", `size check for ${this.filename} failed: ${err}`)
      throw err
    }
  }

  readBlock() {
    if (this.queue.length >= 1) {
      const block = this.queue[0]

      if (block.end > block.start) {

        let stream = fs.createReadStream(this.filename, {
          start: block.start,
          end: block.end - 1,
          encoding: this.encoding
        })

        stream.on('error', (error) => {
          this.logger.error(`Tail error: ${error}`)
          this.emit('error', error)
        })

        stream.on('end', () => {
          let _ = this.queue.shift()
          if (this.queue.length > 0) this.internalDispatcher.emit('next')

          if (this.flushAtEOF && this.buffer.length > 0) {
            this.emit('line', this.buffer)
            this.buffer = ""
          }
        })

        stream.on('data', (d) => {
          if (this.separator === null){
            this.emit("line", d)
            return undefined
          }

          this.buffer += d
          let parts = this.buffer.split(this.separator)
          this.buffer = parts.pop()
          for (const chunk of parts)
            this.emit("line", chunk)

        })
      }
    }
  }

  change() {
    let p = this.latestPosition()

    //scenario where text is not appended but it's actually a w+
    if (p < this.currentCursorPos) this.currentCursorPos = p

    else if (p > this.currentCursorPos) {
      this.queue.push({ start: this.currentCursorPos, end: p })
      this.currentCursorPos = p

      if (this.queue.length == 1) this.internalDispatcher.emit("next")
    }
  }

  watch(startingCursor:number, flush?:boolean) {
    if (this.isWatching) return

    this.logger.info(`filesystem.watch present? ${fs.watch != undefined}`)
    this.logger.info(`useWatchFile: ${this.useWatchFile}`)

    this.isWatching = true
    this.currentCursorPos = startingCursor
    //force a file flush is either fromBeginning or nLines flags were passed.
    if (flush) this.change()

    if (!this.useWatchFile && fs.watch) {
      this.logger.info(`watch strategy: watch`)
      this.watcher = fs.watch(
        this.filename,
        this.fsWatchOptions,
        (e:string, filename:string) => this.watchEvent(e, filename)
      )
    }
    else {
      this.logger.info(`watch strategy: watchFile`)
      fs.watchFile(this.filename, this.fsWatchOptions, (curr, prev) => { this.watchFileEvent(curr, prev) })
    }
  }

  rename(filename:string) {
    /**
     * TODO
     * MacOS sometimes throws a rename event for no reason.
     * Different platforms might behave differently.
     * see https://nodejs.org/api/fs.html#fs_fs_watch_filename_options_listener
     * filename might not be present.
     * https://nodejs.org/api/fs.html#fs_filename_argument
     * Better solution would be check inode but it will require a timeout and  a sync file read.
     */
    if (filename === undefined || filename !== this.filename) {
      this.unwatch()
      if (this.follow) {
        this.filename = path.join(this.absPath, filename)
        this.rewatchId = setTimeout((() => {
          try {
            this.watch(this.currentCursorPos)
          }
          catch (ex) {
            this.logger.error(`'rename' event for ${this.filename}. File not available anymore.`)
            this.emit("error", ex)
          }
        }), 1000)
      }
      else {
        this.logger.error(`'rename' event for ${this.filename}. File not available anymore.`)
        this.emit("error", `'rename' event for ${this.filename}. File not available anymore.`)
      }
    }
  }

  watchEvent(e:string, evtFilename:string) {
    try {
      if (e === 'change') this.change()
      else if (e === 'rename') this.rename(evtFilename)
    }
    catch (err) {
      this.logger.error(`watchEvent for ${this.filename} failed: ${err}`)
      this.emit("error", `watchEvent for ${this.filename} failed: ${err}`)
    }
  }

  watchFileEvent(
    curr:Record<'size', number>,
    prev:Record<'size', number>
  ) {
    if(curr.size <= prev.size) return undefined

    //Update this.currentCursorPos so that a consumer can determine if entire file has been handled
    this.currentCursorPos = curr.size
    this.queue.push({ start: prev.size, end: curr.size })
    if (this.queue.length == 1) this.internalDispatcher.emit("next")
  }

  unwatch() {
    this.watcher ? this.watcher.close() : fs.unwatchFile(this.filename)

    if (this.rewatchId) {
      clearTimeout(this.rewatchId)
      this.rewatchId = undefined
    }

    this.isWatching = false
    // TODO: is this correct behavior?
    this.queue = []
    this.logger && this.logger.info(`Unwatch ${this.filename}`)
  }

}
