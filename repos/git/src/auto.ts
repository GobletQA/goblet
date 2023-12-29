import type { TGitOpts } from '@GGT/types'
import type { ChildProcess } from 'node:child_process'

import path from 'node:path'
import { Logger } from '@GGT/utils/logger'
import { spawn } from 'node:child_process'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { validateWatchArgs } from '@GGT/utils/validateWatchArgs'

export type TAutoWatchOpts = Partial<TGitOpts>
export type TGitWatchers = Record<string, ChildProcess>

const GitWatchers:TGitWatchers = {}


export const killAllWatchers = () => {
  Object.values(GitWatchers).forEach((child) => {
    try{ child.kill() }
    catch(err){}
  })
}

export const killWatcher = (loc:string) => {
  const child = GitWatchers[loc]
  if(!child) return false
  
  child.kill()
  GitWatchers[loc] = undefined
  delete GitWatchers[loc]

  return true
}

export const hasWatcher = (loc:string) => Boolean(GitWatchers[loc])

const getSpawnFile = () => {
  const dist = path.basename(__dirname).startsWith(`dist`)
  const loc = dist ? __dirname : path.join(__dirname, `../dist`)
  return path.join(loc, `./watch.js`)
}

export const autoWatch = async (opts:TAutoWatchOpts=emptyObj) => {
  return new Promise((res, rej) => {
    
    validateWatchArgs(opts)

    const {
      name,
      token,
      local,
      remote,
      branch,
      username,
      provider,
    } = opts

    if(GitWatchers[local]){
      Logger.log(`Found existing repo watcher for: ${local}`)
      return GitWatchers[local]
    }

    Logger.log(`Starting repo watcher at: ${local}`)
    const spawnfile = getSpawnFile()

    const watchEnvs = {
      GB_GIT_REPO_WATCH_NAME: name,
      GB_GIT_REPO_WATCH_TOKEN: token,
      GB_GIT_REPO_WATCH_REMOTE: remote,
      GB_GIT_REPO_WATCH_BRANCH: branch,
      GB_GIT_REPO_WATCH_USER: username,
      GB_GIT_REPO_WATCH_LOCATION: local,
      GB_GIT_REPO_WATCH_PROVIDER: provider,
    }

    const prc = spawn(`node`, [spawnfile], {
      stdio: `inherit`,
      env: {...process.env, ...watchEnvs}
    })

    GitWatchers[local] = prc

    Logger.log(`Repo watcher started at: ${local}`)

    return res(prc)
  })
}

process.on(`exit`, () => {
  Object.entries(GitWatchers).forEach(([loc, child]) => {
    Logger.log(`Killing repo watcher at: ${loc}`)

    try{ child.kill() }
    catch(err){
      Logger.error(`[Git Watcher] Failed to kill child watcher`)
      Logger.log(err.message)
    }
  })
})