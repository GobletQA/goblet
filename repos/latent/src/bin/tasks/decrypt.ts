import type {
  TTask,
  TTaskActionArgs
} from '@GLT/cli/types'

import {Latent} from "@GLT/latent"

/**
 *
 * Decrypts a repos secrets file
 * Requires a repo token, or the repo url and the correct latent token for the repo
 * @example
 * pnpm lt:dev dec token="<repo-token>" location="/path/to/secrets/directory"
 * @example
 * pnpm lt:dev dec remote="<repo-ref>" location="/path/to/secrets/directory"
 *
 */
const decryptAct = (args:TTaskActionArgs) => {
  const { remote, token, repo, ...rest } = args.params

  const latent = new Latent()
  const tok = token || latent.getToken(remote)

  const secrets = latent.secrets.load({
    ...rest,
    token: tok
  })

  if(!secrets) throw new Error(`No secrets found`)

  console.log(`Repo Secrets`)
  console.table(secrets)
}

export const decrypt:TTask = {
  name: `decrypt`,
  alias: [`dec`],
  description: `Decrypt a file from path`,
  action: decryptAct,
  options: {
    token: {},
    remote: {},
    repo: {},
    location: {
      required: true,
      alias: [`file`, `secrets`],
      description: `Path location of the secrets file. Overrides the repo option`
    },
    encoded: {
      type: `bool`,
      default: true,
      alias: [`base64`, `b64`],
      description: `Is the token Base64 encoded. Ignored if token option is undefined`
    }
  }
}
