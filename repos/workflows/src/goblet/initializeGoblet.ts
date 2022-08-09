import { git } from '../git'
import { failResp } from './response'
import { Logger } from '@keg-hub/cli-utils'
import { setupGoblet } from './setupGoblet'
import { mountRepo } from '../repo/mountRepo'
import { branchRepo } from '../repo/branchRepo'
import { configureGitArgs } from '../utils/configureGitArgs'

import { TWFArgs } from '@gobletqa/workflows/types'


/**
 * Workflow for initializing goblet within a git repo
 * Steps
 *  1. Clones down a repo from a git provider (/repo/mountRepo)
 *  2. Creates a new branch from the default branch (/repo/branchRepo)
 *  3. Sets up goblet config and folder structure (/goblet/setupGoblet)
 *  4. Commits the changes to the repo (/repo/commitRepo)
 *  5. Pushes the branch with the changes to the git provider (/repo/pushRepo)
 * @function
 * @public
 * @throws
 * @param {Object} args - Data needed to execute the workflow
 * @param {Object} args.user - User metadata of the user currently logged in
 * @param {Object} args.repo - Repo metadata for setting up goblet
 */
export const initializeGoblet = async (args:TWFArgs) => {
  Logger.subHeader(`Running Initialize Goblet Workflow`)
  const token = git.loadToken(args)
  const gitArgs = await configureGitArgs({ ...args, token })

  if (token === false)
    return failResp(
      { setup: false, mounted: false, status: 'unknown' },
      'Failed repo mount. Improper git validation'
    )

  // Ensure the repo is not already mounted before trying to mount it
  const mounted = await git.exists(args)
  if (mounted) {
    Logger.log(`Repo is already mounted at ${gitArgs.local}`)

    return await setupGoblet(args, gitArgs, true)
  }

  gitArgs.createBranch
    ? Logger.log(`Creating new branch...`)
    : Logger.log(`Reusing existing branch...`)

  const branch = gitArgs.createBranch
    ? await branchRepo(gitArgs)
    : gitArgs.branch

  Logger.log(`Mounting remote repo...`)
  await mountRepo({ ...gitArgs, branch })

  Logger.log(`Setting up Goblet...`)
  const setupResp = await setupGoblet(args, gitArgs)

  setupResp.mounted && setupResp.setup
    ? Logger.success(`Finished running Initialize Goblet Workflow`)
    : Logger.error(
        Logger.colors.red(`Failed Initialize Goblet Workflow\n`),
        Logger.colors.white(`\t- Repo Mount: ${setupResp.mounted}\n`),
        Logger.colors.white(`\t- Repo Setup: ${setupResp.setup}\n`)
      )

  return setupResp
}
