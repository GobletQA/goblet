import type {
  TGitOpts,
  TRepoWatchCb
} from '@GGT/types'

import { Logger } from '@gobletqa/logger'
import pRec from 'pending-promise-recycler'
import chokidar, { FSWatcher } from 'chokidar'
import { checkCall } from '@keg-hub/jsutils/checkCall'

const throwError = (err:string|Error) => {
  if(typeof err === `string`) throw new Error(err)
  throw err
}
 

/**
 * Helper to handel a repoWatcher that already exists
 * Sets the onEvent if it doesn't exist
 * Auto starts the watcher if autoStart is passed
 */
const handleExisting = (
  existingWatcher:RepoWatcher,
  options:TGitOpts,
  cfg:TRepoWatcherCreate
) => {
  const { onStop, onEvent, autoStart } = cfg

  if(existingWatcher.watcher)
    RepoWatcher.log(`Can not create new RepoWatcher, Already watching path ${options?.local}`, `warn`)
  else {
    if(!existingWatcher.onEvent && onEvent) existingWatcher.onEvent = onEvent
    if(!existingWatcher.onStop && onStop) existingWatcher.onStop = onStop
    autoStart && existingWatcher.start()
  }

  return existingWatcher
}

export type TRepoWatcherCreate = {
  onStop?:()=>void
  autoStart?:boolean
  onEvent?:TRepoWatchCb,
  
}

/**
 * Watches a repos directory for changes
 * Calls a callback when a change happens
 */
export class RepoWatcher {

  options:TGitOpts
  watcher:FSWatcher
  onEvent:TRepoWatchCb
  onStop:()=>void|Promise<void>

  static watchers:Record<string, RepoWatcher> = {}
  static showLogs:boolean = Boolean(process.env.NODE_ENV === 'local')


/**
 * Helper to log message when logging is enabled
 * Enabled by default when NODE_ENV === 'local'
 */
  static log(message:string, type=`info`){
    RepoWatcher.showLogs &&  Logger[type](message)
  }

/**
 * Gets a cached watcher based on the passed in local string
 */
  static getWatcher(local:string){
    return RepoWatcher.watchers[local]
  }

  /**
   * Creates a new instance of a RepoWatcher based on the local path
   * Caches the created watcher for removing at a later time
   */
  static create(
    options:TGitOpts,
    cfg:TRepoWatcherCreate
  ){
    const existingWatcher = RepoWatcher.watchers[options?.local]

    if(existingWatcher) return handleExisting(existingWatcher, options, cfg)

    const repoWatcher = new RepoWatcher(options, cfg)
    RepoWatcher.watchers[options.local] = repoWatcher

    return repoWatcher
  }

  /**
   * Removes a RepoWatcher
   * First it stops the watcher
   * Then removing the instance from cache
   */
  static async remove(local:string){
    const repoWatcher = RepoWatcher.watchers[local]
    if(!repoWatcher)
      return RepoWatcher.log(`RepoWatcher instance for path ${local} does not exist`, `warn`)
    
    await repoWatcher.stop()

    RepoWatcher.watchers[local] = undefined
    delete RepoWatcher.watchers[local]
  }

  constructor(
    options:TGitOpts,
    cfg:TRepoWatcherCreate
  ){
    const { onStop, onEvent, autoStart } = cfg
    this.options = options
    !this.options?.local
      && throwError(`Can not create RepoWatcher, missing local path`)
    
    if(onStop) this.onStop = onStop
    if(onEvent) this.onEvent = onEvent

    autoStart && this.start()
  }

  /**
   * Starts watching the options.local directory for changes
   * Calls the passed in callbacks if they exist
   */
  start(onEvent?:TRepoWatchCb){
    if(this.watcher){
      RepoWatcher.log(`RepoWatcher instance already watching path ${this.options.local}`, `warn`)
      return this
    }

    !this.options.local
      && throwError(`Can not start RepoWatcher, missing local path`)
    
    RepoWatcher.log(`Starting RepoWatcher for path ${this.options.local}...`)

    this.watcher = chokidar.watch(
      this.options.local,
      {
        depth: 20,
        persistent: true,
        ignoreInitial: true,
        // awaitWriteFinish: true,
        cwd: this.options.local,
        ignored: /(^|[\/\\])\..|node_modules/,
      }
    )
      .on('all', (event, path) => {
        checkCall(onEvent, event, path, this)
        checkCall(this.onEvent, event, path, this)
      })

    return this
  }

  /**
   * Stops a watcher and removes it from the RepoWatcher instance
   * This technically means the start method of the RepoWatcher instance could be called again
   */
  async stop(){
    await checkCall(this?.onStop)

    if(!this.watcher)
      return RepoWatcher.log(`Can not stop RepoWatcher instance, watcher does not exist`, `warn`)
    
    await this.watcher.close()
    this.watcher = undefined
  }

}
