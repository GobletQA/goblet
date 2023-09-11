import type {
  TTask,
  TTaskActionArgs
} from '@GLT/cli/types'

import {Latent} from "@GLT/latent"
import {getRefFromPath, findSecretsLoc} from '../helpers'


/**
 *
 * Decrypts a repos secrets file
 * Requires a repo token, or the repo url and the correct latent token for the repo
 * @example
 * pnpm lt:dev dec token="<repo-token>" location="/path/to/secrets/directory"
 * @example
 * pnpm lt:dev dec ref="<repo-ref>" location="/path/to/secrets/directory"
 *
 */
const decryptAct = (args:TTaskActionArgs) => {
  const { ref, key,  token, encoded } = args.params

  const latent = new Latent()
  const tok = token || latent.getToken(ref || getRefFromPath(args.params), key)

  const secrets = latent.secrets.load({
    encoded,
    token: tok,
    location: findSecretsLoc(args.params),
  })

  if(!secrets) throw new Error(`No secrets found`)

  console.log(`Repo Secrets`)
  console.table(secrets)
}

export const decrypt:TTask = {
  name: `decrypt`,
  alias: [`dec`],
  description: `Decrypt a file from a path`,
  example: `pnpm lt:dev dec ref="<repo-ref>" location="/path/to/secrets/directory"`,
  action: decryptAct,
  options: {
    token: {},
    location: {},
    key: {},
    ref: {},
    repo: {},
    root: {},
    encoded: {
      type: `bool`,
      default: true,
      alias: [`base64`, `b64`],
      description: `Is the token Base64 encoded. Ignored if token option is undefined`
    },
  }
}
