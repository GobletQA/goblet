import type { TGitData, TRepoOpts, TWFArgs, TGitOpts } from '@GWF/types'


import { git, RepoWatcher } from '../git'
import { Logger } from '@keg-hub/cli-utils'
import { omitKeys, wait } from '@keg-hub/jsutils'
import { repoSecrets } from '../repo/repoSecrets'
import { getRepoName } from '../utils/getRepoName'
import { failResp, successResp } from './response'
import { copyTemplate } from '../utils/copyTemplate'
import { createRepoWatcher } from '../repo/mountRepo'
import { gobletLoader } from '@gobletqa/shared/libs/loader'
import { configureGitOpts } from '../utils/configureGitOpts'

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
    gitData.local,
    args.repoTemplate
  )

  if (!hasGoblet)
    return failResp(
      { setup: false },
      `Goblet could not be created or loaded for repo ${gitOpts.remote}`
    )

  Logger.log(`Loading goblet.config...`)
  const gobletConfig = gobletLoader({ basePath: gitOpts.local })
  if(!gobletConfig)
    return failResp({ setup: false }, `Could not load goblet.config for mounted repo`)

  const repo = {
    ...gobletConfig,
    git:gitData,
    name: getRepoName(gitOpts.remote),
  } as TRepoOpts

  const secretsResp = await repoSecrets(gitOpts, repo)

  return secretsResp
    || successResp({ setup: true }, { repo }, `Finished running Setup Goblet Workflow`)
}

