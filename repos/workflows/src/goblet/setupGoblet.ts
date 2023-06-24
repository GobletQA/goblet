import type { TWFArgs, TGitOpts } from '@gobletqa/workflows/types'
import type { TGitData, TRepoOpts } from '@gobletqa/workflows/types/shared.types'

import { git, RepoWatcher } from '../git'
import { Logger } from '@keg-hub/cli-utils'
import { omitKeys, wait } from '@keg-hub/jsutils'
import { getRepoName } from '../utils/getRepoName'
import { failResp, successResp } from './response'
import { copyTemplate } from '../utils/copyTemplate'
import { createRepoWatcher } from '../repo/mountRepo'
import { gobletLoader } from '@gobletqa/shared/libs/loader'
import { configureGitOpts } from '../utils/configureGitOpts'

/**
 * Workflow that creates the folder structure for goblet (templates/repo/default-template)
 * @function
 * @public
 * @throws
 */
export const setupGoblet = async (
  args:TWFArgs,
  gitOpts:TGitOpts,
  mounted?:boolean
) => {

  Logger.subHeader(`Running Setup Goblet Workflow`)

  const token = (gitOpts && gitOpts.token) || (await git.loadToken(args))
  gitOpts = gitOpts || (await configureGitOpts({ ...args, token }))
  const gitData = omitKeys(gitOpts, ['email', 'token']) as TGitData

  const isMounted = mounted || (await git.exists(args))
  if (!isMounted)
    return failResp({ setup: false }, `Repo ${gitOpts.remote} is not connected`)

  Logger.log(`Checking for repo watcher at path ${gitOpts.local}...`)
  const watcher = RepoWatcher.getWatcher(gitOpts.local)

  watcher
    ? Logger.log(`Found existing watcher at path ${gitOpts.local}`)
    : createRepoWatcher(gitOpts)

  Logger.log(`Waiting 1 second for watcher to initialize...`)
  await wait(1000)

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

  const { remote } = gitData


  return successResp(
    { setup: true },
    {
      repo: {
        ...gobletConfig,
        git:gitData,
        name: getRepoName(gitOpts.remote),
      } as TRepoOpts,
    },
    `Finished running Setup Goblet Workflow`
  )
}

