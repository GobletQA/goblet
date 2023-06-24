import type { TWFArgs, TGitOpts } from '@gobletqa/workflows/types'
import type { TGitData, TRepoOpts } from '@gobletqa/workflows/types/shared.types'

import { git, RepoWatcher } from '../git'
import { Logger } from '@keg-hub/cli-utils'
import { omitKeys, wait } from '@keg-hub/jsutils'
import { getRepoName } from '../utils/getRepoName'
import { failResp, successResp } from './response'
import { copyTemplate } from '../utils/copyTemplate'
import { createRepoWatcher } from '../repo/mountRepo'
import { configureGitOpts } from '../utils/configureGitOpts'

// TODO: Figure out how to load this from shared repo. May need to more to diff location
// Maybe create a gobletConfig repo - Dedicating to loading the config
import { configAtPath } from '@gobletqa/shared/goblet'


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

  const token = (gitArgs && gitArgs.token) || (await git.loadToken(args))
  gitArgs = gitArgs || (await configureGitOpts({ ...args, token }))
  const gitOpts = omitKeys(gitArgs, ['email', 'token']) as TGitData

  const isMounted = mounted || (await git.exists(args))
  if (!isMounted)
    return failResp({ setup: false }, `Repo ${gitArgs.remote} is not connected`)

  Logger.log(`Checking for repo watcher at path ${gitArgs.local}...`)
  const watcher = RepoWatcher.getWatcher(gitArgs.local)

  watcher
    ? Logger.log(`Found existing watcher at path ${gitArgs.local}`)
    : createRepoWatcher(gitArgs)

  Logger.log(`Waiting 1 second for watcher to initialize...`)
  await wait(1000)

  Logger.log(`Checking goblet configuration...`)
  const hasGoblet = await copyTemplate(gitArgs.local, args.repoTemplate)

  if (!hasGoblet)
    return failResp(
      { setup: false },
      `Goblet could not be created or loaded for repo ${gitArgs.remote}`
    )

  Logger.log(`Loading goblet.config...`)
  const gobletConfig = await configAtPath(gitArgs.local)
  if(!gobletConfig)
    return failResp({ setup: false }, `Could not load goblet.config for mounted repo`)

  const { remote } = gitOpts


  return successResp(
    { setup: true },
    {
      repo: {
        ...gobletConfig,
        git:gitOpts,
        name: getRepoName(gitArgs.remote),
      } as TRepoOpts,
    },
    `Finished running Setup Goblet Workflow`
  )
}

