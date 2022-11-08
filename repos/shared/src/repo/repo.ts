import type { TFileTypes, TRepoOpts } from '../types'
import type { TWFGobletConfig, TGitOpts } from '@gobletqa/workflows/types'

import { Parkin } from '@ltipton/parkin'
import { getWorld } from '@GSH/repo/world'
import { noOpObj, } from '@keg-hub/jsutils'
import { getFileTypes } from '@GSH/utils/getFileTypes'
import {
  getUserRepos,
  statusGoblet,
  initializeGoblet,
  disconnectGoblet,
} from '@gobletqa/workflows'


/**
 * Class variation of the a goblet config
 * Has the same properties as a Goblet Config object, but includes some helper methods
 */
export class Repo {

  /**
   * Gets all repos for a user, including each repos branches
   * The filters them out based on exists
   * @param {Object} opts - Options for make API query to Provider
   * @param {string} opts.token - Provider Token for making authenticated API calls
   * 
   * @returns {Array} - Found repos and their branches
   */
  static getUserRepos = async (opts:Record<string, any>) => {
    return await getUserRepos(opts)
  }

  /**
   * Gathers metadata and creates a Repo Model object of a mounted / connected
   * @param {Object} config - Goblet global App Config, NOT A REPO CONFIG
   * @param {Object} [repoData] - Past metadata stored about the repo on the frontend
   *
   * @returns {Object} - Repo Model object built by the response of the statusGoblet workflow
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
   * @param {Object} args - Arguments for disconnecting a repo
   * @param {string} args.username - Name of the user that mounted the repo
   *
   * @returns {Object} - Response from the disconnectGoblet workflow
   */
  static disconnect = async ({ username }) => {
    return await disconnectGoblet({
      user: {
        gitUser: username,
      },
    })
  }

  /**
   * Creates a Repo Class instance by connecting to an external git repo
   * @param {Object} args - Arguments for connecting a repo
   *
   * @returns {Object} - Response from the initializeGoblet workflow
   */
  static fromWorkflow = async (args) => {
    const {
      token,
      branch,
      repoUrl,
      username,
      newBranch,
      createBranch,
    } = args

    const url = new URL(repoUrl)
    const name = url.pathname.split('/').pop().replace('.git', '')
    const provider = url.host.split('.').slice(0).join('.')

    const resp = await initializeGoblet({
      repo: {
        name,
        token,
        branch,
        provider,
        newBranch,
        createBranch,
        url: repoUrl,
      },
      user: { gitUser: username },
    })

    if (!resp || !resp.mounted)
      throw new Error(
        `[ERROR] Could not mount repo ${repoUrl}.\n${resp ? resp.message : ''}`
      )

    return new Repo({
      ...resp.repo,
    })
  }

  /**
   * World object for the repo
   * Get's loaded when the instance is created
   * @memberOf Repo
   * @type {Object}
   */
  world:Record<string, any>

  /**
   * Paths object for the repo
   * Locations of the repo files on the host file system
   * @memberOf Repo
   * @type {Object}
   */
  paths:Record<string, string>

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
  parkin = undefined

  name:string
  environment:string
  fileTypes:TFileTypes

  constructor(config:TRepoOpts = noOpObj as TRepoOpts) {
    const { environment, paths, git, name } = config

    this.setEnvironment(environment)

    this.git = git
    this.name = name
    this.paths = paths
    this.world = getWorld(config, this)
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
  refreshWorld = async (opts:Record<string, any>=noOpObj) => {
    const { environment } = opts
    this.setEnvironment(environment)
    
    this.world = getWorld(this)
    this.parkin.world = this.world

    return this.world
  }
}

