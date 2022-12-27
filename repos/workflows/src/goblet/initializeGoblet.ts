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
 *  4. Saves the changes to the repo (/repo/saveRepo)
 *  5. Pushes the branch with the changes to the git provider (/repo/pushRepo)
 * @function
 * @public
 * @throws
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

  gitArgs.createBranch
    ? Logger.log(`Creating new branch...`)
    : Logger.log(`Reusing existing branch...`)

  // Check if we should create a new branch
  const branch = gitArgs.createBranch && gitArgs.newBranch
    ? await branchRepo(gitArgs)
    : gitArgs.branch

  // Ensure the repo is not already mounted before trying to mount it
  const mounted = await git.exists(args)
  if (mounted) {
    Logger.log(`Repo is already mounted at ${gitArgs.local}`)

    return await setupGoblet(args, gitArgs, true)
  }

  Logger.log(`Mounting remote repo...`)
  // Mount the git repo, passing in the branch to be used
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
