import type {
  TGitData,
  TRepoOpts,
  TFileTypes,
  TRepoPaths,
  TExamConfig,
  TGBWorldCfg,
  TGobletConfig,
  TRecorderOpts,
  TGobletPWConfig,
  TGScreencastConfig,
} from '@GRP/types'

import { getWorld } from './world'
import { Parkin } from '@ltipton/parkin'
import { LatentRepo } from './latentRepo'
import { ENVS } from '@gobletqa/environment'
import { getFileTypes } from '@gobletqa/goblet'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'

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


  /**
   * World object for the repo
   * Get's loaded when the instance is created
   * @memberOf Repo
   * @type {Object}
   */
  #world:TGBWorldCfg

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

  /**
   * Custom config for configure test executor
   * Default is exam, but others could be used
   * @memberOf Repo
   * @type {Object}
   */
  testConfig?:Partial<TExamConfig>

  name:string
  latent:LatentRepo
  environment:string
  fileTypes:TFileTypes
  recorder: TRecorderOpts
  screencast?:TGScreencastConfig
  playwright?:TGobletPWConfig={}

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

    if($ref) this.$ref = $ref
    else if(git?.remote) {
      const url = new URL(git?.remote)
      this.$ref = url.pathname.replace(/\.git$/, ``)
    }

    this.latent = new LatentRepo()
  }

  get world(){
    /**
     * This forces every call to `repo.world` to reload the world
     * It's much slower, but ensure it gets an up-to-date world
     * There seem to be some cases when the world is not being properly updated
     * At some point would be nice to switch to something like this
     * `this.#world = this.#world || getWorld(this)`
     */
    this.#world = getWorld(this as TGobletConfig)
    return this.#world
  }

  set world(update:TGBWorldCfg){
    this.#world = getWorld(this as TGobletConfig)
    if(this.parkin) this.parkin.world = this.#world
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

