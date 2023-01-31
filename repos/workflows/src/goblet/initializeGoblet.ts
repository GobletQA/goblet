import type { TGitOpts, TWFArgs } from '@gobletqa/workflows/types'

import { Logger } from '@keg-hub/cli-utils'
import { git } from '@gobletqa/workflows/git'
import { GitApi } from '@gobletqa/workflows/repo/gitApi'
import { ensureMounted } from '@gobletqa/workflows/repo/ensureMounted'
import { validateInitArgs } from '@gobletqa/workflows/utils/validateInitArgs'
import { configureGitOpts } from '@gobletqa/workflows/utils/configureGitOpts'
import { ensureBranchExists } from '@gobletqa/workflows/repo/ensureBranchExists'

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
  const gitOpts = await configureGitOpts({ ...args, token })
  const gitApi = new GitApi(gitOpts)

  const notValid = validateInitArgs(token, gitOpts)
  if(notValid) return notValid

  const branch = await ensureBranchExists(gitApi, gitOpts)
  const setupResp = await ensureMounted(args, {...gitOpts, branch })

  setupResp.mounted && setupResp.setup
    ? Logger.success(`Finished running Initialize Goblet Workflow`)
    : Logger.error(
        Logger.colors.red(`Failed Initialize Goblet Workflow\n`),
        Logger.colors.white(`\t- Repo Mount: ${setupResp.mounted}\n`),
        Logger.colors.white(`\t- Repo Setup: ${setupResp.setup}\n`)
      )

  return setupResp
}
