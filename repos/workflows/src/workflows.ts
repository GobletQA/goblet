import type { TGitOpts } from '@gobletqa/git'
import type { TRepoFromCreate, TRepoMountStatus } from '@gobletqa/repo'
import type {
  TWFStatusResp,
  TWFGobletConfig,
  TRepoGraphRepos,
  TRepoFromWorkflow,
} from '@GWF/types'

import { Logger } from '@GWF/utils/logger'
import { wfcache, WfCache } from './wfCache'
import { getRepoPath }from '@gobletqa/git'
import { resetGobletConfig } from '@gobletqa/goblet'
import { resetInjectedLogs } from '@gobletqa/logger'
import { removeCachedDefs } from '@gobletqa/shared/fs'
import { Repo, resetCachedWorld } from '@gobletqa/repo'
import { GitlabGraphApi, GithubGraphApi } from '@GWF/providers'
import {
  createGoblet,
  statusGoblet,
  initializeGoblet,
  disconnectGoblet,
} from '@GWF/goblet'

const tryMethod = (name:string, cb:(...args:any[]) => any, ...rest:any[]) => {
  try {
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
    if(cached) return cached

    const { repo, ...status } = await statusGoblet(config, repoData, false)
    if(!repo || !status.mounted)
      return { status }

    const instance = new Repo(repo)
    await instance.ensureParkinDefs()
    const resp = {
      status,
      repo: instance,
      steps: instance.parkin.steps
    }
    this.#cache.save(repoData.username, resp, resp?.repo?.paths?.repoRoot)

    return resp
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
    if(cached) return cached

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
    tryMethod(`removeCachedDefs`, removeCachedDefs)
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