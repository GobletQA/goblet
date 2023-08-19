import type {
  TGitMeta,
  TGitOpts,
  TCmdResp,
  TRepoGitState,
  TSaveMetaData,
} from '@GWF/types'

import { git, validateGitOpts } from './gitCmd/git'
import { deepMerge, emptyObj } from '@keg-hub/jsutils'


const checkGitOpts = (instance:Record<`options`, TGitOpts>) => {
  if(instance.options) return
  throw new Error(`GitFs Class instance requires the correct git options passed when initialized`)
}

const callGit = async <T=TCmdResp>(method:string, options:TGitOpts, ...args:any[]) => {
  checkGitOpts({ options })
  const [err, resp] = await git[method](options, ...args)
  if(err) throw err

  return resp as T
}

/**
 * Helper class to eventually replace git.ts
 * This better matches the Git Api classes so they are consistent
 */
export class GitFs {
  options:TGitOpts
  username:string
  loadToken = git.loadToken

  constructor(gitOpts?:TGitOpts){
    if(gitOpts) this.options = validateGitOpts(gitOpts)
  }

  init = async (gitOpts?:TGitOpts) => {
    if(gitOpts) this.options = deepMerge(this.options, validateGitOpts(gitOpts))
    checkGitOpts(this)

    await this.setUser()
    await this.clone()
  }

  setUser = async () => {
    await callGit(`setUser`, this.options)
    const { email, name, username } = this.options
    this.username = name || username || email.split(`@`).shift()
  }

  setRemote = async () => {
    await git.remote.add(this.options, { url: this.options.remote })
  }


  pull = async () => await callGit(`pull`, this.options)
  push = async () => await callGit(`push`, this.options)
  clone = async () => await callGit(`clone`, this.options)
  remove = async (args:TGitMeta) => await git.remove(args)
  checkRepo = async () => await callGit<TRepoGitState>(`checkRepo`, this.options)
  exists = async (args:TGitMeta, local?:string) => await git.exists(args, local || this.options.local)
  commit = async (metaData?:TSaveMetaData) => await callGit(`commit`, this.options, emptyObj, metaData)

}

export const gitFs = new GitFs()