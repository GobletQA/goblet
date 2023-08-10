import type {
  TTask,
  TTaskActionArgs
} from '@GLT/cli/types'

import {Latent} from "@GLT/latent"
import {findSecretsLoc} from '../helpers'
import { getRefFromPath } from '../helpers'

/**
 *
 * Rekeys an encrypted file
 * Requires the old ref and a new ref to generate an old and new token
 * Uses generated tokens to first decrypt the encrypted file, then re-encrypt with the new token
 * Can also set a new latent key for old and new if it has changed
 * @example
 * pnpm lt:dev rekey old="<old-repo-ref>" update="<new-repo-ref>" location="/path/to/secrets/directory"
 * @example
 * // Uses the goblet config `$ref` for the update ref
 * pnpm lt:dev rekey old="<old-repo-ref>" repo="/path/to/repo"
 *
 */
const rekeyAct = (args:TTaskActionArgs) => {
  const {
    repo,
    location,
    old,
    update,
    latentOld,
    latentUpdate,
    ...rest
  } = args.params

  const latent = new Latent()

  const failed = latent.secrets.rekey({
    old,
    oldKey: latentOld,
    updateKey: latentUpdate,
    location: findSecretsLoc(args.params),
    // Don't include the location param. Used for secrets location in this task
    update: update || getRefFromPath({...rest, repo}),
  })

  failed.length
    ? new Error(`The following keys failed to be rekeyed: \n${failed.join(`\n\t`)}`)
    : console.log(`Repo Secrets file has be updated successfully`)

}

export const rekey:TTask = {
  name: `rekey`,
  alias: [`rek`],
  description: `Re-encrypts an encrypted file with a new key. Requires both an "old" and "update" ref`,
  action: rekeyAct,
  options: {
    old: {
      required: true,
      alias: [`od`, `oldRef`],
      description: `The old repo "ref" that was originally used to generate a token`
    },
    update: {
      alias: [`up`, `ut`, `updateRef`],
      description: `The new repo "ref" used to generate a new token. If option not passed, uses the goblet config`
    },
    location: {},
    latentOld: {
      alias: [ `oldkey`, `okey`, `oKey`, `ok`],
      description: `Original latent key used to generate a token`
    },
    latentUpdate: {
      description: `New latent key to use to generate the new token`,
      alias: [ `updatekey`, `ukey`, `uKey`, `uk`],
    },
    repo: {},
    root: {},
    encoded: {
      type: `bool`,
      default: true,
      alias: [`base64`, `b64`],
      description: `Is the token Base64 encoded. Ignored if token option is undefined`
    }
  }
}
