import type { TWorldConfig } from '@ltipton/parkin'
import type { TWFGobletConfig, TGitOpts } from '@gobletqa/workflows/types'
import type {
  TRepoOpts,
  TFileTypes,
  TRepoPaths,
  TRecorderOpts,
  TInternalPaths,
  TRepoGraphRepos,
  TRepoFromCreate,
  TRepoMountStatus,
  TRepoFromWorkflow,
} from '../types'

import { Parkin } from '@ltipton/parkin'
import { getWorld } from '@GSH/repo/world'
import { noOpObj, } from '@keg-hub/jsutils'
import { getFileTypes } from '@GSH/utils/getFileTypes'
import { resetGobletConfig } from '@GSH/goblet/getGobletConfig'
import {
  createGoblet,
  statusGoblet,
  GithubGraphApi,
  initializeGoblet,
  disconnectGoblet,
} from '@gobletqa/workflows'


/**
 * Class variation of the a goblet config
 * Has the same properties as a Goblet Config object, but includes some helper methods
 */
export class Repo {

  /**
   * Extra code paths loaded with the goblet config JSON file
   * Allows extending it with logic at runtime 
   */
  merge?:string[]=[]

  /**
   * Gets all repos for a user, including each repos branches
   * The filters them out based on exists
   * @param {Object} opts - Options for make API query to Provider
   * @param {string} opts.token - Provider Token for making authenticated API calls
   * 
   * @returns {Array} - Found repos and their branches
   */
  static getUserRepos = async (opts:TRepoGraphRepos) => {
    const graphApi = new GithubGraphApi()
    return await graphApi.userRepos(opts)
  }

  /**
   * Gathers metadata and creates a Repo Model object of a mounted / connected
   */
  static status = async (
    config:TWFGobletConfig,
    repoData:TGitOpts
  ) => {
    const { repo, ...status } = await statusGoblet(config, repoData, false)

    return !repo || !status.mounted
      ? { status }
      : { status, repo: new Repo(repo) }
  }

  /**
   * Disconnects a previously connected repo
   */
  static disconnect = async ({ username }:Record<`username`, string>) => {
    // Clear the existing loaded goblet config
    resetGobletConfig()

    return await disconnectGoblet({
      user: {
        gitUser: username,
      },
    })
  }

  static create = async (args:TRepoFromCreate) => {
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

    return {
      repo: new Repo(repo),
      status: status as TRepoMountStatus,
    }
  }

  /**
   * Creates a Repo Class instance by connecting to an external git repo
   */
  static fromWorkflow = async (args:TRepoFromWorkflow) => {
    const {
      token,
      branch,
      repoUrl,
      username,
      newBranch,
      branchFrom,
    } = args

    const url = new URL(repoUrl)
    const name = url.pathname.split('/').pop().replace('.git', '')
    const provider = url.host.split('.').slice(0).join('.')

    const { repo, ...status } = await initializeGoblet({
      token,
      user: {
        gitUser: username
      },
      repo: {
        name,
        branch,
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
   * World object for the repo
   * Get's loaded when the instance is created
   * @memberOf Repo
   * @type {Object}
   */
  world:TWorldConfig

  /**
   * Paths object for the repo
   * Locations of the repo files on the host file system
   * @memberOf Repo
   * @type {Object}
   */
  paths:TRepoPaths

  /**
   * Git metadata for the repo
   * Containing local / remote paths, and user / provider information
   * @memberOf Repo
   * @type {Object}
   */
  git:Record<string, any>


  /**
   * Instance of the parkin class
   * Holds the an instance relative to this repo only
   * @memberOf Repo
   * @type {Object}
   */
  parkin:Parkin = undefined


  name:string
  environment:string
  fileTypes:TFileTypes
  recorder: TRecorderOpts

  // Temporary - this should be remove
  internalPaths:TInternalPaths

  constructor(config:TRepoOpts = noOpObj as TRepoOpts) {
    const {
      git,
      name,
      environment,
      paths=noOpObj as TRepoPaths,
    } = config

    this.setEnvironment(environment)

    this.git = git
    this.name = name
    this.paths = { ...paths, repoRoot: paths?.repoRoot || git?.local }

    this.world = getWorld(this)
    this.parkin = new Parkin(this.world)
    this.fileTypes = getFileTypes(this.paths.repoRoot, this.paths)

  }

  /**
   * Sets the loaded environment for the repo
   * @memberOf Repo
   * @type {function}
   *
   */
  setEnvironment = (environment?:string) => {
    this.environment = environment || process.env.GOBLET_ENV || `develop`
    if(!process.env.GOBLET_ENV) process.env.GOBLET_ENV = this.environment
  }

  /**
   * Reloads the world object for the repo
   * @memberOf Repo
   * @type {function}
   *
   * @return {Object} - The reloaded repo.world object
   */
  refreshWorld = async (
    opts:Record<`environment`, string>=noOpObj as Record<`environment`, string>
  ) => {
    const { environment } = opts
    this.setEnvironment(environment)

    this.world = getWorld(this)
    this.parkin.world = this.world

    return this.world
  }
}

