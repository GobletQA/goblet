import type { LatentRepo } from './latentRepo'
import type { TWorldConfig } from '@ltipton/parkin'
import type { TProviderData } from './getProviderData'
import type {
  TGitOpts,
  TGitData,
  TRepoOpts,
  TFileTypes,
  TRepoPaths,
  TGobletConfig,
  TRecorderOpts,
  TInternalPaths,
  TWFGobletConfig,
  TRepoGraphRepos,
  TRepoFromCreate,
  TRepoMountStatus,
  TGScreencastConfig,
  TRepoFromWorkflow,
  TGobletPWConfig,
} from '@GWF/types'

import { getWorld } from './world'
import { Parkin } from '@ltipton/parkin'
import { latentRepo } from './latentRepo'
import { emptyObj, } from '@keg-hub/jsutils'
import { ENVS } from '@gobletqa/environment'
import { getFileTypes } from '@gobletqa/goblet'
import { getProviderData } from './getProviderData'
import { resetGobletConfig } from '@gobletqa/goblet'
import { GitlabGraphApi, GithubGraphApi } from '@GWF/providers'
import {
  createGoblet,
  statusGoblet,
  initializeGoblet,
  disconnectGoblet,
} from '@GWF/goblet'


type TRepoWorldRefresh = {
  environment:string
  refreshEnv?:boolean
}

/**
 * Class variation of the a goblet config
 * Has the same properties as a Goblet Config object, but includes some helper methods
 */
export class Repo {

  /**
   * Extra code paths loaded with the goblet config JSON file
   * Allows extending it with logic at runtime 
   */
  $merge?:string[]=[]

  static getProvider = async (opts:TProviderData) => {
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
  static getUserRepos = async (opts:TRepoGraphRepos) => {
    const graphApi = opts?.provider?.toLowerCase().includes(`gitlab`)
      ? new GitlabGraphApi()
      : new GithubGraphApi()

    const data = await Repo.getProvider(opts)
    return await graphApi.userRepos({...opts, ...data})
  }

  /**
   * Gathers metadata and creates a Repo Model object of a mounted / connected
   */
  static status = async (
    config:TWFGobletConfig,
    repoData:TGitOpts
  ) => {
    const data = await Repo.getProvider(repoData)
    const { repo, ...status } = await statusGoblet(config, {...repoData, ...data}, false)

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
      branch,
      provider,
      username,
      newBranch,
      branchFrom,
      description,
      organization,
    } = args

    const data = await Repo.getProvider(args)
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
   * Creates a Repo Class instance by connecting to an external git repo
   */
  static fromWorkflow = async (args:TRepoFromWorkflow) => {
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

    const data = await Repo.getProvider({...args, provider})
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
   * World object for the repo
   * Get's loaded when the instance is created
   * @memberOf Repo
   * @type {Object}
   */
  #world:TWorldConfig

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
  git:TGitData

  /**
   * Repo key reference
   */
  $ref?:string=undefined

  /**
   * Instance of the parkin class
   * Holds the an instance relative to this repo only
   * @memberOf Repo
   * @type {Object}
   */
  parkin:Parkin = undefined


  name:string
  latent:LatentRepo
  environment:string
  fileTypes:TFileTypes
  recorder: TRecorderOpts
  screencast?:TGScreencastConfig
  playwright?:TGobletPWConfig={}

  // Temporary - this should be remove
  internalPaths:TInternalPaths

  constructor(config:TRepoOpts = emptyObj as TRepoOpts) {
    const {
      git,
      name,
      $ref,
      environment,
      paths=emptyObj as TRepoPaths,
    } = config

    this.setEnvironment(environment, false)

    this.git = git
    this.name = name
    this.paths = { ...paths, repoRoot: paths?.repoRoot || git?.local }

    /**
     * Sets the GOBLET_CONFIG_BASE env
     * So should be used before any calls to it are made for a loaded repo
     * Specifically calls to load the goblet config for the repo from the base path
     */
    this.parkin = new Parkin(this.world)
    this.fileTypes = getFileTypes(this.paths.repoRoot, this.paths)
    this.latent = latentRepo

    this.$ref = $ref || git?.remote.replace(/\.git$/, ``)
  }

  get world(){
    // this.#world = this.#world || getWorld(this)
    this.#world = getWorld(this as TGobletConfig)
    return this.#world
  }

  set world(update:TWorldConfig){
    this.#world = getWorld(this as TGobletConfig)
  }


  /**
   * Sets the loaded environment for the repo
   * @memberOf Repo
   * @type {function}
   *
   */
  setEnvironment = (environment?:string, refreshWld:boolean=true) => {
    this.environment = environment || ENVS.GOBLET_ENV
    if(!ENVS.GOBLET_ENV && this.environment) ENVS.GOBLET_ENV = this.environment
    
    // Pass false to ensure we don't get into an infinite loop
    refreshWld && this.refreshWorld({
      refreshEnv: false,
      environment: this.environment,
    })
  }

  /**
   * Reloads the world object for the repo
   * @memberOf Repo
   * @type {function}
   *
   * @return {Object} - The reloaded repo.world object
   */
  refreshWorld = async (
    opts:TRepoWorldRefresh=emptyObj as TRepoWorldRefresh
  ) => {
    const { environment, refreshEnv } = opts
    // Pass false to ensure we don't get into an infinite loop
    refreshEnv && this.setEnvironment(environment, false)

    // Force refresh of the world object
    this.world = undefined

    // Then update parkin's instance of the world
    if(this.parkin) this.parkin.world = this.world

    return this.world
  }
}

