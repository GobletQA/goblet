import type { CipherGCMTypes } from 'crypto'
import type { TLatentCryptoOpts } from '@GLT/types'

import crypto from 'crypto'
import {emptyObj} from '@keg-hub/jsutils'
import { fromB64 } from '@GLT/utils/base64'


export class LatentCrypto {
  #ivLength:number = 12
  #keyLength:number = 64
  #tagLength:number = 16
  algorithm:CipherGCMTypes=`aes-256-gcm`

  constructor(opts:TLatentCryptoOpts=emptyObj){
    Object.assign(this, opts)
  }

  #getKey = (encryption:string) => {
    if (encryption.length !== this.#keyLength)
      throw new Error(`Encryption Secret must have ${this.#keyLength} hex characters`)

    return Buffer.from(encryption, `hex`)
  }

  encrypt = (
    input: string,
    encoded:string,
    base64:boolean=true
  ): string => {
    const encryption = base64 ? fromB64(encoded) : encoded

    const key = this.#getKey(encryption)
    const initVector = crypto.randomBytes(this.#ivLength)
    const cipher = crypto.createCipheriv(this.algorithm, key, initVector, {
      authTagLength: this.#tagLength,
    })

    const cypherText =
      initVector.toString(`hex`) +
      cipher.update(input, `utf-8`, `hex`) +
      cipher.final(`hex`)

    return cipher.getAuthTag().toString(`hex`) + cypherText
  }

  decrypt = (
    encrypted: string,
    encoded:string,
    base64:boolean=true
  ): string => {
    try {
      const encryption = base64 ? fromB64(encoded) : encoded

      const key = this.#getKey(encryption)
      const authTag = Buffer.from(encrypted.substring(0, this.#tagLength * 2), `hex`)
      const initVector = Buffer.from(
        encrypted.substring(this.#tagLength * 2, this.#tagLength * 2 + this.#ivLength * 2),
        `hex`
      )
      const cypherText = encrypted.substring(this.#tagLength * 2 + this.#ivLength * 2)
      const decipher = crypto.createDecipheriv(this.algorithm, key, initVector, {
        authTagLength: this.#tagLength,
      })
      decipher.setAuthTag(authTag)

      return decipher.update(cypherText, `hex`, `utf-8`) + decipher.final(`utf8`)
    }
    catch(err){
      if(err.code === `ERR_CRYPTO_INVALID_IV`) return ``

      throw err
    }
  }
}

