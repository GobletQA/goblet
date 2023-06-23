import {LatentError} from "./error"

/**
 * Loads the ltSecretToken from environment variable
 * Then un-sets the environment variable containing the secret
 *
 * TODO: look into loading the token from a file?
 *  - i.e. Set the token as a kubernetes secret, mount it to the pod as a file
 *  - Load the file content into the ltSecretToken variable
 *  - Then delete the file from disk
 */
export const getLTToken = () => {
  const ltSecretToken = process.env.GB_LT_TOKEN_SECRET

  if(!ltSecretToken)
    throw new LatentError(`Missing value for Latent Token Secret ENV`, `getLTToken`)

  process.env.GB_LT_TOKEN_SECRET = undefined
  delete process.env.GB_LT_TOKEN_SECRET 

  return ltSecretToken
}
