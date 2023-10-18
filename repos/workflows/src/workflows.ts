import type { TProviderData } from '@GWF/utils/getProviderData'
import type {
  TGitOpts,
  TWFGobletConfig,
  TRepoGraphRepos,
  TRepoFromCreate,
  TRepoMountStatus,
  TRepoFromWorkflow,
} from '@GWF/types'

import { resetGobletConfig } from '@gobletqa/goblet'
import { getProviderData } from '@GWF/utils/getProviderData'
import { GitlabGraphApi, GithubGraphApi } from '@GWF/providers'

import {
  createGoblet,
  statusGoblet,
  initializeGoblet,
  disconnectGoblet,
} from '@GWF/goblet'

import { Repo } from '@gobletqa/repo'

export class Workflows {

  getProvider = async (opts:TProviderData) => {
    return getProviderData(opts)
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

    const data = await this.getProvider(opts)
    return await graphApi.userRepos({...opts, ...data})
  }


  create = async (args:TRepoFromCreate) => {
    const {
      name,
      branch,
      provider,
      username,
      newBranch,
      branchFrom,
      description,
      organization,
    } = args

    const data = await this.getProvider(args)
    const { repo, ...status } = await createGoblet({
      ...data,
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

    return {
      repo: new Repo(repo),
      status: status as TRepoMountStatus,
    }
  }

  /**
   * Gathers metadata and creates a Repo Model object of a mounted / connected
   */
  status = async (
    config:TWFGobletConfig,
    repoData:TGitOpts
  ) => {
    const data = await this.getProvider(repoData)
    const { repo, ...status } = await statusGoblet(config, {...repoData, ...data}, false)

    return !repo || !status.mounted
      ? { status }
      : { status, repo: new Repo(repo) }
  }


  /**
   * Creates a Repo Class instance by connecting to an external git repo
   */
  fromWorkflow = async (args:TRepoFromWorkflow) => {
    const {
      branch,
      repoUrl,
      username,
      newBranch,
      branchFrom,
    } = args

    const url = new URL(repoUrl)

    const repoId = (args.repoId || url.pathname.replace(/\.git$/, ``)).replace(/^\//, ``)
    const name = repoId.split('/').pop()
    const provider = url.host.split('.').slice(0).join('.')

    const data = await this.getProvider({...args, provider})
    const { repo, ...status } = await initializeGoblet({
      ...data,
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

    return {
      repo: new Repo(repo),
      status: status as TRepoMountStatus,
    }
  }


  /**
   * Disconnects a previously connected repo
   */
  disconnect = async ({ username }:Record<`username`, string>) => {
    // Clear the existing loaded goblet config
    resetGobletConfig()

    return await disconnectGoblet({
      user: {
        gitUser: username,
      },
    })
  }

}


export const workflows = new Workflows()