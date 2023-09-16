import type { TWFCreateArgs } from '@GWF/types'

import { git } from '@gobletqa/git'
import { Logger } from '@gobletqa/logger'
import { setupGoblet } from './setupGoblet'
import { GithubApi } from '@GWF/providers/githubApi'
import { ensureMounted } from '@gobletqa/repo/ensureMounted'
import { configureGitOpts } from '@GWF/utils/configureGitOpts'
import { validateCreateArgs } from '@GWF/utils/validateCreateArgs'
import { ensureBranchExists } from '@gobletqa/repo/ensureBranchExists'

const buildCreateUrl = (args:TWFCreateArgs) => {
  const { create } = args
  const { organization } = create
  const createPath = organization
    ? `orgs/${organization}/repos`
    : `user/repos`

  return `https://api.github.com/${createPath}`
}

export const createGoblet = async (args:TWFCreateArgs) => {

  Logger.subHeader(`Running Create Goblet Workflow`)

  const { create, user } = args
  const createUrl = buildCreateUrl(args)

  const token = git.loadToken(args) as string

  const repoMeta = await GithubApi.createRepo({
    token,
    url: createUrl,
    name: create.name,
    description: create.description
  })

  const gitOpts = await configureGitOpts({
    user,
    token,
    repo: {
      branchFrom: true,
      url: repoMeta.url,
      newBranch: create.branch,
      branch: repoMeta.default_branch,
    },
  })

  const notValid = validateCreateArgs(token, gitOpts)
  if(notValid) return notValid

  const gitApi = new GithubApi(gitOpts)
  const branch = await ensureBranchExists(gitApi, gitOpts)
  const gitState = await ensureMounted(args, {...gitOpts, branch })

  Logger.log(`Setting up Goblet...`)
  const setupResp = await setupGoblet(args, gitOpts, gitState.mounted)

  setupResp.mounted && setupResp.setup
    ? Logger.success(`Finished running Create Goblet Workflow`)
    : Logger.error(
        Logger.colors.red(`Failed Create Goblet Workflow\n`),
        Logger.colors.white(`\t- Repo Mount: ${setupResp.mounted}\n`),
        Logger.colors.white(`\t- Repo Setup: ${setupResp.setup}\n`)
      )

  return setupResp

}