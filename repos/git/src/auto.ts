import type { TGitOpts } from '@GGT/types'
import type { ChildProcess } from 'node:child_process'

import path from 'node:path'
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

    if(GitWatchers[local]) return GitWatchers[local]

    const ext = path.basename(__dirname).startsWith(`dist`) ? `js` : `ts`
    const spawnfile = path.join(__dirname, `./watch.${ext}`)

    const prc = spawn(`node`, [spawnfile], {
      detached: true,
      stdio: `ignore`,
      env: {
        ...process.env,
        GB_GIT_REPO_WATCH_NAME: name,
        GB_GIT_REPO_WATCH_TOKEN: token,
        GB_GIT_REPO_WATCH_REMOTE: remote,
        GB_GIT_REPO_WATCH_BRANCH: branch,
        GB_GIT_REPO_WATCH_USER: username,
        GB_GIT_REPO_WATCH_LOCATION: local,
        GB_GIT_REPO_WATCH_PROVIDER: provider,
      }
    })

    prc.unref()

    GitWatchers[local] = prc

    return res(prc)
  })
}

process.on(`exit`, () => {
  Object.values(GitWatchers).forEach((child) => {
    try{ child.kill() }
    catch(err){}
  })
})