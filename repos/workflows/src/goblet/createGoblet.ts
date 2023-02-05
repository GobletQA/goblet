import type { TWFCreateArgs } from '@gobletqa/workflows/types'

import { Logger } from '@keg-hub/cli-utils'
import { git } from '@gobletqa/workflows/git'
import { GitApi } from '@gobletqa/workflows/repo/gitApi'
import { ensureMounted } from '@gobletqa/workflows/repo/ensureMounted'
import { configureGitOpts } from '@gobletqa/workflows/utils/configureGitOpts'
import { ensureBranchExists } from '@gobletqa/workflows/repo/ensureBranchExists'
import { validateCreateArgs } from '@gobletqa/workflows/utils/validateCreateArgs'

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

  const repoMeta = await GitApi.createRepo({
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
      url: repoMeta.html_url,
      newBranch: create.branch,
      branch: repoMeta.default_branch,
    },
  })

  const notValid = validateCreateArgs(token, gitOpts)
  if(notValid) return notValid

  const gitApi = new GitApi(gitOpts)
  const branch = await ensureBranchExists(gitApi, gitOpts)
  const setupResp = await ensureMounted(args, {...gitOpts, branch })

  setupResp.mounted && setupResp.setup
    ? Logger.success(`Finished running Create Goblet Workflow`)
    : Logger.error(
        Logger.colors.red(`Failed Create Goblet Workflow\n`),
        Logger.colors.white(`\t- Repo Mount: ${setupResp.mounted}\n`),
        Logger.colors.white(`\t- Repo Setup: ${setupResp.setup}\n`)
      )

  return setupResp

}