import type {
  TTask,
  TTaskActionArgs
} from '@GLT/cli/types'

import {Latent} from "@GLT/latent"
import { getRefFromPath } from '../helpers'


/**
 *
 * Generates a repo token
 * Requires a ref repo url, or a path to a git repo and the correct latent token
 * Latent token should be set as the `GB_LT_TOKEN_SECRET` ENV
 * @example
 * pnpm lt:dev gen repo="/path/to/git/repo"
 * @example
 * pnpm lt:dev gen ref="<repo-ref>"
 *
 */
const generateAct = (args:TTaskActionArgs) => {
  const { ref:reference, token, repo, ...rest } = args.params

  if(!reference && !repo)
    throw new Error(`Task requires a ref url or a path to a local git repository`)

  const latent = new Latent()

  const ref = reference || getRefFromPath(args.params)
  if(!ref) throw new Error(`Failed to find repo "ref" is required to generate a token, but one could not be found.`)
  
  const tok = latent.getToken(ref)

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
    location: {},
    ref: {},
    repo: {},
    root: {},
  }
}