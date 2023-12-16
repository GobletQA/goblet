import type { TRepoMountStatus } from '@gobletqa/repo'
import type {
  TGitOpts,
  TWFGobletConfig,
  TRepoGraphRepos,
  TRepoFromCreate,
  TRepoFromWorkflow,
} from '@GWF/types'

import { resetGobletConfig } from '@gobletqa/goblet'
import { resetInjectedLogs } from '@gobletqa/logger'

/**
 * Todo: look into dynamically loading this, so it's only loaded on screencast repo, not backend repo
 */
import { removeCachedDefs } from '@gobletqa/shared/fs'

import { wfcache, WfCache } from './wfCache'
import { Repo, resetCachedWorld } from '@gobletqa/repo'
import { GitlabGraphApi, GithubGraphApi } from '@GWF/providers'

import {
  createGoblet,
  statusGoblet,
  initializeGoblet,
  disconnectGoblet,
} from '@GWF/goblet'


export class Workflows {

  cache:WfCache=wfcache

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


  create = async (args:TRepoFromCreate) => {
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

    const resp = {
      repo: new Repo(repo),
      status: status as TRepoMountStatus,
    }

    this.cache.save(username, resp, resp?.repo?.paths?.repoRoot)

    return resp
  }

  /**
   * Gathers metadata and creates a Repo Model object of a mounted / connected
   */
  status = async (
    config:TWFGobletConfig,
    repoData:TGitOpts
  ) => {
    
    const cached = this.cache.find(repoData.username)
    if(cached) return cached

    const { repo, ...status } = await statusGoblet(config, repoData, false)
    if(!repo || !status.mounted)
      return { status }

    const resp = { status, repo: new Repo(repo) }
    this.cache.save(repoData.username, resp, resp?.repo?.paths?.repoRoot)

    return resp
  }


  /**
   * Creates a Repo Class instance by connecting to an external git repo
   */
  fromWorkflow = async (args:TRepoFromWorkflow) => {
    const {
      token,
      branch,
      repoUrl,
      username,
      newBranch,
      branchFrom,
    } = args

    const cached = this.cache.find(username)
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

    const resp = {
      repo: new Repo(repo),
      status: status as TRepoMountStatus,
    }

    this.cache.save(username, resp, resp?.repo?.paths?.repoRoot)

    return resp
  }


  /**
   * Disconnects a previously connected repo
   */
  disconnect = async ({ username }:Record<`username`, string>) => {
    // Clear the existing loaded goblet config
    resetGobletConfig()
    resetCachedWorld(username)
    resetInjectedLogs()
    removeCachedDefs?.()
    this.cache.remove(username)

    return await disconnectGoblet({
      user: {
        gitUser: username,
      },
    })
  }

}
