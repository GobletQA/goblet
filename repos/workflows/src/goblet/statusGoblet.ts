import type { TGitOpts } from '@gobletqa/git'
import type { TRepoOpts } from '@gobletqa/repo'
import type { TGobletCfgLoaderResp } from '@gobletqa/goblet'
import type { TGobletConfig } from '@gobletqa/shared/types'
import type {
  TWFResp,
  TWFGobletConfig,
} from '@GWF/types'


import path from 'path'
import {failResp} from './response'
import { Logger } from '@gobletqa/logger'
import { repoSecrets } from '@gobletqa/repo'
import { fileSys } from '@keg-hub/cli-utils'
import { ENVS } from '@gobletqa/environment'
import { gobletLoader } from '@gobletqa/goblet'
import { getRepoName, git } from '@gobletqa/git'
import { noOpObj } from '@keg-hub/jsutils/noOpObj'
import { omitKeys } from '@keg-hub/jsutils/omitKeys'
import { autoWatch, hasWatcher } from '@gobletqa/git/auto'

const { pathExists } = fileSys
const emptyOpts = noOpObj as TGitOpts
const emptyLoaderResp = noOpObj as TGobletCfgLoaderResp

export const RepoLocalMount = ENVS.GOBLET_MOUNT_ROOT && ENVS.GB_SH_LOCAL_MOUNT
  ? path.join(ENVS.GOBLET_MOUNT_ROOT, ENVS.GB_SH_LOCAL_MOUNT)
  : `/goblet/repos/goblet-local`

/**
 * @typedef {Object} RepoStatus
 * @property {boolean} mounted - If a repo is mounted
 * @property {string} status - Mounted status as a string
 * @property {string} mode - Current mode of Goblet, determines a repo folder location
 * @property {string} [message] - Message about the status
 * @property {string} [location] - Locations where the repo should exist
 *
 */

const validatePath = async location => {
  const [err, exists] = await pathExists(location)
  if (err && err.code !== `ENOENT`) throw new Error(err)

  return exists
}

/**
 * Checks the status of a mounted repo for local mode
 * In local mode the folder path is always the same
 * The local mounted folder contains a `.goblet-empty-status.json` file
 * If this file exists, then no mount exists
 * If it does not exist, then the folder was overwritten with the mount
 * So we know a mount exists
 * @param {Object} config - Global Goblet config object
 *
 * @return {RepoStatus} - Status object for the checked repo
 */
const statusForLocal = async (config:TWFGobletConfig, opts:TGitOpts) => {
  Logger.info(`Checking repo status in local mode...`)

  const isValidPath = await validatePath(RepoLocalMount)

  // Check if the local mount folder exists
  // If not then it's empty
  const { config:gobletConfig } = isValidPath
    ? gobletLoader({
        remote: opts.remote,
        basePath: RepoLocalMount,
      })
    : emptyLoaderResp

  try {
    repoSecrets(opts, gobletConfig)
  }
  catch(err){
    return failResp({ setup: false }, err.message)
  }

  return !isValidPath || !gobletConfig
    ? {
        repo: {
          name: ``,
          git: { local: config?.paths?.repoRoot },
          world: {},
          environment: ``,
          fileTypes: {},
        } as TRepoOpts,
        setup: false,
        mode: `local`,
        mounted: false,
        status: `unmounted`,
        message: `Repo volume mount does not exist`,
      } as TWFResp
    : {
        setup: true,
        mode: 'local',
        mounted: true,
        status: 'mounted',
        message: 'Repo mounted',
        repo: {
          git: { local: gobletConfig.paths.repoRoot },
          name: path.basename(gobletConfig.paths.repoRoot),
          ...gobletConfig,
        } as  TGobletConfig,
      } as TWFResp
}

/**
 * In VNC mode, if we have a user Id we can check if the repo is mounted
 * Otherwise we just return unknown status
 * @param {Object} config - Global Goblet config object
 * @param {Object} config.repo - Repo config || Repo class instance
 * @param {string} config.repo.url - Url of the repo to check
 * @param {string} config.url - Url of the repo to check if repo.url does not exist
 * @param {Object} config.user - User model object
 * @param {string} config.username - Git Provider user name
 *
 * @return {RepoStatus} - Status object for the checked repo
 */
const statusForVnc = async (opts:TGitOpts=emptyOpts) => {
  Logger.info(`Checking repo status in vnc mode...`)

  const { username, branch, remote, local } = opts

  const unknownStatus:TWFResp = {
    mode: `vnc`,
    setup: false,
    mounted: false,
    status: `unknown`,
    message: `Repo status is unknown`
  }

  if (!username && !branch && !remote && !local) return unknownStatus

  /*
   * Use local to find the goblet.config
   * Load the goblet config and build the repo
   * respond with status and loaded repo
   */
  const isMounted = await git.exists(null, local)
  if (!isMounted) return unknownStatus

  Logger.log(`Loading goblet.config...`)
  const {
    config:gobletConfig
  } = gobletLoader({
    remote,
    basePath: local
  }) || emptyLoaderResp

  const repo = {
    git: omitKeys(opts, [`token`]),
    ...gobletConfig,
    name: getRepoName(remote),
  } as TRepoOpts

  // const secretsFail = await repoSecrets(opts, repo)
  // if(secretsFail) return secretsFail

  Logger.log(`Checking for repo watcher at path ${opts.local}...`)
  const watcher = hasWatcher(opts.local)
  watcher
    ? Logger.log(`Found existing watcher at path ${opts.local}`)
    : await autoWatch(opts)

  return !gobletConfig
    ? unknownStatus
    : {
        repo,
        mode: `vnc`,
        setup: true,
        mounted: true,
        status: `mounted`,
        message: `Repo mounted`,
      } as TWFResp

}

/**
 * Default implementation for running Goblet locally
 * This is expected to be overwritten by External Services
 * Builds a Repo Model Object based on the local opts
 *
 * @param {Object} config - Global Goblet config object
 * @param {Object} opts - Git Metadata about the repo
 *
 * @return {RepoStatus} - Status object for the checked repo
 */
export const statusGoblet = async (config:TWFGobletConfig, opts:TGitOpts, log=true) => {

  log && Logger.subHeader(`Running Status Goblet Workflow`)

  if (!config)
    throw new Error(`The statusGoblet workflow requires a goblet config object`)

  return config?.screencast?.active
    ? await statusForVnc(opts)
    : await statusForLocal(config, opts)
}
