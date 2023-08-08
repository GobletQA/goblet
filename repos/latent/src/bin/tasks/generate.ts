import type {
  TTask,
  TTaskParams,
  TTaskActionArgs
} from '@GLT/cli/types'

import {Latent} from "@GLT/latent"

const getRemoteFromPath = (repoLoc:string) => {
  return ``
}

/**
 *
 * Generates a repo token
 * Requires a remote repo url, or a path to a git repo and the correct latent token
 * Latent token should be set as the `GB_LT_TOKEN_SECRET` ENV
 * @example
 * pnpm lt:dev gen repo="/path/to/git/repo"
 * @example
 * pnpm lt:dev gen remote="<repo-ref>"
 *
 */
const generateAct = (args:TTaskActionArgs) => {
  const { remote, token, repo, ...rest } = args.params

  if(!remote && !repo)
    throw new Error(`Task requires a remote url or a path to a local git repository`)

  const latent = new Latent()

  const ref = remote || getRemoteFromPath(repo)
  const tok = latent.getToken(remote)

  console.log(`Repo Token Generated`)
  console.table({ [ref]:tok })
}



export const generate:TTask = {
  name: `generate`,
  alias: [`gen`],
  description: `Generate an encryption token`,
  action: generateAct,
  options: {
    token: {},
    remote: {},
    repo: {},
  }
}