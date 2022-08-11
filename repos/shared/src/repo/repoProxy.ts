const { Parkin } = require('@ltipton/parkin')
const { getWorld } = require('@GSH/Repo/world')
const { getFileTypes } = require('@GSH/Utils/getFileTypes')
const { isObj, noOpObj, noPropArr, } = require('@keg-hub/jsutils')
const {
  getUserRepos,
  statusGoblet,
  initializeGoblet,
  disconnectGoblet,
} = require('@gobletqa/workflows')


/**
 * Class variation of the a goblet config
 * Has the same properties as a Goblet Config object, but includes some helper methods
 */
class Repo {

  /**
   * Gets all repos for a user, including each repos branches
   * The filters them out based on exists
   * @param {Object} opts - Options for make API query to Provider
   * @param {string} opts.token - Provider Token for making authenticated API calls
   * 
   * @returns {Array} - Found repos and their branches
   */
  static getUserRepos = async opts => {
    
  }

  /**
   * Gathers metadata and creates a Repo Model object of a mounted / connected
   * @param {Object} config - Goblet global App Config, NOT A REPO CONFIG
   * @param {Object} [repoData] - Past metadata stored about the repo on the frontend
   *
   * @returns {Object} - Repo Model object built by the response of the statusGoblet workflow
   */
  static status = async (config, repoData) => {
   
  }

  /**
   * Disconnects a previously connected repo
   * @param {Object} args - Arguments for disconnecting a repo
   * @param {string} args.username - Name of the user that mounted the repo
   *
   * @returns {Object} - Response from the disconnectGoblet workflow
   */
  static disconnect = async ({ username }) => {
    
  }

  /**
   * Creates a Repo Class instance by connecting to an external git repo
   * @param {Object} args - Arguments for connecting a repo
   *
   * @returns {Object} - Response from the initializeGoblet workflow
   */
  static fromWorkflow = async (args) => {
    
  }


  constructor(config = noOpObj) {
    
  }

  /**
   * World object for the repo
   * Get's loaded when the instance is created
   * @memberOf Repo
   * @type {Object}
   */
  get world () {
    
    return {}
  }


  /**
   * Paths object for the repo
   * Locations of the repo files on the host file system
   * @memberOf Repo
   * @type {Object}
   */
  get paths () {
    
    return {}
  }

  /**
   * Git metadata for the repo
   * Containing local / remote paths, and user / provider information
   * @memberOf Repo
   * @type {Object}
   */
  get git () {
    
    return {}
  }

  /**
   * Instance of the parkin class
   * Holds the an instance relative to this repo only
   * @memberOf Repo
   * @type {Object}
   */
  get parkin () {
    
    return {}
  }

  /**
   * Reloads the world object for the repo
   * @memberOf Repo
   * @type {function}
   *
   * @return {Object} - The reloaded repo.world object
   */
  refreshWorld = async () => {

  }
}

module.exports = {
  Repo,
}
