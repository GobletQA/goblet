import type { TWFArgs } from '@GWF/types'
import type { TGobletConfig } from '@gobletqa/shared/types'
import type { TGitOpts, TGitData } from '@gobletqa/git'
import type { TGobletCfgLoaderResp } from '@gobletqa/goblet'

import { Logger } from '@gobletqa/logger'
import { wait } from '@keg-hub/jsutils/wait'
import { gobletLoader } from '@gobletqa/goblet'
import { failResp, successResp } from './response'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { omitKeys } from '@keg-hub/jsutils/omitKeys'
import { copyTemplate } from '../utils/copyTemplate'
import { replaceGobletConfigRef } from '@gobletqa/goblet'
import { configureGitOpts } from '../utils/configureGitOpts'
import { git, RepoWatcher, getRepoName } from '@gobletqa/git'
import { repoSecrets, createRepoWatcher } from '@gobletqa/repo'

const emptyLoaderResp = emptyObj as TGobletCfgLoaderResp

const setupWatcher = async (gitOpts:TGitOpts,) => {
  Logger.log(`Checking for repo watcher at path ${gitOpts.local}...`)
  const watcher = RepoWatcher.getWatcher(gitOpts.local)

  watcher
    ? Logger.log(`Found existing watcher at path ${gitOpts.local}`)
    : createRepoWatcher(gitOpts)

  Logger.log(`Waiting 1 second for watcher to initialize...`)
  await wait(1000)
}


const getGitData = async (
  args:TWFArgs,
  gitArgs:TGitOpts,
) => {

  const token = (gitArgs && gitArgs.token) || git.loadToken(args)
  const gitOpts = gitArgs || (await configureGitOpts({ ...args, token }))
  const gitData = omitKeys(gitArgs, ['email', 'token']) as TGitData

  return { gitData, gitOpts }
}


const replaceRefInConfig = (gitData:TGitData, location?:string) => {
  return new Promise((res, rej) => {
    setTimeout(async () => {
      try {
        const replaced = await replaceGobletConfigRef(gitData, location)
        Logger.success(`Successfully replaced $ref in Goblet Config`)
        return res(replaced)
      }
      catch(err){
        Logger.warn(`Failed to replace $ref in Goblet Config`)
        Logger.log(`Goblet Config Location: ${location}`)
        Logger.log(err.message)
        return res(false)
      }
    }, 10)
  })
}

/**
 * Workflow that creates the folder structure for goblet (templates/repo/default-template)
 * @function
 * @public
 * @throws
 */
export const setupGoblet = async (
  args:TWFArgs,
  gitArgs:TGitOpts,
  mounted?:boolean
) => {

  Logger.subHeader(`Running Setup Goblet Workflow`)

  const {
    gitOpts,
    gitData
  } = await getGitData(args, gitArgs)

  const isMounted = mounted || (await git.exists(args))
  if (!isMounted)
    return failResp({ setup: false }, `Repo ${gitOpts.remote} is not connected`)

  await setupWatcher(gitOpts)

  Logger.log(`Checking goblet configuration...`)
  const hasGoblet = await copyTemplate(
    gitData,
    args.repoTemplate
  )

  if (!hasGoblet)
    return failResp(
      { setup: false },
      `Goblet could not be created or loaded for repo ${gitOpts.remote}`
    )

  Logger.log(`Loading goblet.config...`)
  const {
    location,
    refReplaced,
    config:gobletConfig,
  } = gobletLoader({
    remote: gitOpts.remote,
    basePath: gitOpts.local,
  }) || emptyLoaderResp

  if(!gobletConfig)
    return failResp({ setup: false }, `Could not load goblet.config for mounted repo`)

  refReplaced
    && replaceRefInConfig(gitData, location)

  const namedGobletCfg = {
    ...gobletConfig,
    git:gitData,
    name: getRepoName(gitOpts.remote),
  } as TGobletConfig

  try {
    await repoSecrets(gitOpts, namedGobletCfg)

    return successResp(
      { setup: true },
      { repo: namedGobletCfg },
      `Finished running Setup Goblet Workflow`
    )
  }
  catch(err){
    return failResp({ setup: false }, err.message)
  }
}

