import type { CipherGCMTypes } from 'crypto'

export type TLatentCryptoOpts = {
  algorithm?:CipherGCMTypes
  ivLength?:number
  keyLength?:number
  tagLength?:number
}