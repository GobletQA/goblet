import type { TLatentTokenOpts } from '@GLT/types'


import { createHmac } from 'crypto'
import {emptyObj} from '@keg-hub/jsutils'
import { LatentError } from '@GLT/utils/error'
import { toB64, fromB64 } from '@GLT/utils/base64'
import { getLTToken } from '@GLT/utils/getLTToken'


export class LatentToken {

  sha:string=`sha256`

  constructor(opts:TLatentTokenOpts=emptyObj){
    Object.assign(this, opts)
  }

  /**
   * Creates a token from the passed in ref
   * @private
   */
  #createToken = (ref:string, ltToken?:string) => {
    const hmac = createHmac(this.sha, ltToken || getLTToken())
    return hmac.update(ref).digest(`hex`)
  }

  /**
   * Compares the encoded token with a token generated from the passed in ref
   * @private
   */
  #compare = (ref:string, encoded:string) => {
    const decoded = fromB64(encoded)
    const generated = this.generate(ref)

    if(decoded !== fromB64(generated))
      throw new LatentError(
        `Encoded token does not match reference`,
        `compare`,
        new Error(`The ref "${ref}" generated toekn "${generated}" is not equal token "${decoded}"`)
      )
  }

  /**
   * Generates a secret token from the passed in ref
   * Then base64 encodes it
   */
  generate = (ref:string, ltToken?:string) => {
    try {
      return toB64(this.#createToken(ref, ltToken))
    }
    catch(err){
      throw new LatentError(`[Latent Error] Failed to generate token`, `generate`, err)
    }
  }

  /**
   * Validates the passed in ref matches a previously encoded token
   * Then base64 encodes it
   */
  validate = (ref:string, encoded:string) => {
    try {
      this.#compare(ref, encoded)
      return ref
    }
    catch(err){
      throw new LatentError(`[Latent Error] Token validation failed`, `validate`, err)
    }
  }

}

