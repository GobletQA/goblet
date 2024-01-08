import type { TGitOpts } from '@gobletqa/git'
import type { TRepoFromCreate, TRepoMountStatus } from '@gobletqa/repo'
import type {
  TWFStatusResp,
  TWFGobletConfig,
  TRepoGraphRepos,
  TRepoFromWorkflow,
} from '@GWF/types'

import { Logger } from '@GWF/utils/logger'
import { getRepoPath }from '@gobletqa/git'
import { wait } from '@keg-hub/jsutils/wait'
import { wfcache, WfCache } from './wfCache'
import { resetGobletConfig } from '@gobletqa/goblet'
import { resetInjectedLogs } from '@gobletqa/logger'
import { Repo, resetCachedWorld } from '@gobletqa/repo'
import { removeRepoCacheDefs } from '@gobletqa/shared/fs'
import { GitlabGraphApi, GithubGraphApi } from '@GWF/providers'
import {
  createGoblet,
  statusGoblet,
  initializeGoblet,
  disconnectGoblet,
} from '@GWF/goblet'

const tryMethod = (name:string, cb:(...args:any[]) => any, ...rest:any[]) => {
  try {
    Logger.info(`Calling cache clear method "${name}"...`)
    return cb(...rest)
  }
  catch(err){
    Logger.error(`Cache Clear method "${name}" failed`)
    Logger.error(err)
  }
}


export class Workflows {

  #cache:WfCache=wfcache

  /**
   * Updates the cache manually
   * Used when a step def is edited, and must be reloaded
   * Once reloaded into the repo, this method is called to update the cache
   */
  updateCache = (username:string, data:{repo?:Repo, status?:TRepoMountStatus}) => {
    const cached = this.#cache.find(username)
    this.#cache.save(username, {...cached, data}, data?.repo?.paths?.repoRoot)
  }

  /**
   * Gets all repos for a user, including each repos branches
   * The filters them out based on exists
   * @param {Object} opts - Options for make API query to Provider
   * @param {string} opts.token - Provider Token for making authenticated API calls
   * 
   * @returns {Array} - Found repos and their branches
   */
  getUserRepos = async (opts:TRepoGraphRepos) => {
    const graphApi = opts?.provider?.toLowerCase().includes(`gitlab`)
      ? new GitlabGraphApi()
      : new GithubGraphApi()

    return await graphApi.userRepos(opts)
  }


  create = async (args:TRepoFromCreate):Promise<TWFStatusResp> => {
    const {
      name,
      token,
      branch,
      provider,
      username,
      newBranch,
      branchFrom,
      description,
      organization,
    } = args

    const { repo, ...status } = await createGoblet({
      token,
      user: {
        gitUser: username
      },
      create: {
        name,
        branch,
        provider,
        newBranch,
        branchFrom,
        description,
        organization
      },
    })

    if (!status || !status.mounted)
      throw new Error(
        `[ERROR] Could not create new repo ${name}.\n${status ? status.message : ''}`
      )

    const instance = new Repo(repo)
    await instance.ensureParkinDefs()
    const resp = {
      repo: instance,
      status: status as TRepoMountStatus,
    }

    this.#cache.save(username, resp, resp?.repo?.paths?.repoRoot)

    return resp
  }

  /**
   * Gathers metadata and creates a Repo Model object of a mounted / connected
   */
  status = async (
    config:TWFGobletConfig,
    repoData:TGitOpts
  ):Promise<TWFStatusResp> => {
    
    const cached = this.#cache.find(repoData.username)
    if(cached){
      cached.repo?.refreshWorld?.()
      await cached?.repo?.ensureParkinDefs?.()
      return cached
    }

    const { repo, ...status } = await statusGoblet(config, repoData, false)
    if(!repo || !status.mounted)
      return { status }

    const instance = new Repo(repo)
    await instance.ensureParkinDefs()
    const resp = {status, repo: instance}
    this.#cache.save(repoData.username, resp, resp?.repo?.paths?.repoRoot)

    return resp
  }

  initGobletRetry = async (args:TRepoFromWorkflow, retries:number=0):Promise<TWFStatusResp> => {
    try {
      return this.fromWorkflow(args)
    }
    catch(err){
      if(retries >= 2){
        throw err
      }

      Logger.error(`Initializing repo failed! Retry attempt #${retries+1} of 3 in 1 second`)
      Logger.log(err.stack)

      await wait(1000)
      this.resetCache(args.username)
      return this.initGobletRetry(args, retries + 1)
    }
  }

  /**
   * Creates a Repo Class instance by connecting to an external git repo
   */
  fromWorkflow = async (args:TRepoFromWorkflow):Promise<TWFStatusResp> => {
    const {
      token,
      branch,
      repoUrl,
      username,
      newBranch,
      branchFrom,
    } = args

    const cached = this.#cache.find(username)
    if(cached){
      cached.repo?.refreshWorld?.()
      await cached?.repo?.ensureParkinDefs?.()
      return cached
    }

    const url = new URL(repoUrl)

    const repoId = (args.repoId || url.pathname.replace(/\.git$/, ``)).replace(/^\//, ``)
    const name = repoId.split('/').pop()
    const provider = url.host.split('.').slice(0).join('.')

    const { repo, ...status } = await initializeGoblet({
      token,
      user: {
        gitUser: username
      },
      repo: {
        name,
        branch,
        repoId,
        provider,
        newBranch,
        branchFrom,
        url: repoUrl,
      },
    })

    if (!status || !status.mounted)
      throw new Error(
        `[ERROR] Could not mount repo ${repoUrl}.\n${status ? status.message : ''}`
      )

    const instance = new Repo(repo)
    await instance.ensureParkinDefs()
    const resp = {
      repo: instance,
      status: status as TRepoMountStatus,
    }

    this.#cache.save(username, resp, resp?.repo?.paths?.repoRoot)

    return resp
  }


  resetCache = (username:string) => {
    Logger.warn(`Resetting repo cache ...`)

    const repoLoc = getRepoPath({ user:{ username } })

    // Clear the existing loaded goblet config
    tryMethod(`resetGobletConfig`, resetGobletConfig, repoLoc)
    tryMethod(`resetCachedWorld`, resetCachedWorld, username)
    tryMethod(`resetInjectedLogs`, resetInjectedLogs)
    tryMethod(`removeRepoCacheDefs`, removeRepoCacheDefs)
    tryMethod(`wfCache.remove`, () => this.#cache.remove(username))
  }


  /**
   * Disconnects a previously connected repo
   */
  disconnect = async ({ username }:Record<`username`, string>) => {

    this.resetCache(username)

    Logger.warn(`Disconnecting repo for user ${username}...`)

    return tryMethod(`disconnectGoblet`, async () => await disconnectGoblet({user: {gitUser: username}}))
  }

}


export const workflows = new Workflows()