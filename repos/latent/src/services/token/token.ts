import type { TLatentTokenOpts } from '@GLT/types'

import { createHmac } from 'crypto'
import {emptyObj} from '@keg-hub/jsutils'
import { toB64, fromB64 } from '@GLT/utils/base64'

const ltSecretToken = process.env.GB_LT_TOKEN_SECRET

export class LatentToken {

  sha:string=`sha256`

  constructor(opts:TLatentTokenOpts=emptyObj){
    Object.assign(this, opts)
  }

  #createToken = (item:string) => {
    const hmac = createHmac(this.sha, ltSecretToken)
    return hmac.update(item).digest(`hex`)
  }

  #compare = (ref:string, encoded:string) => {
    if(fromB64(encoded) !== fromB64(this.generate(ref)))
      throw new Error(`Encoded token does not match reference`)
  }

  /**
   * jwt.sign(data, secret, { algorithm: algorithm, expiresIn: exp })
   */
  generate = (ref:string) => {
    return toB64(this.#createToken(ref))
  }

  validate = (ref:string, encoded:string) => {
    this.#compare(ref, encoded)

    return ref
  }

}

