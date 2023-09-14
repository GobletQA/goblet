import type { TJokerOpts } from '@GJK/types'
import { BaseProvider } from '@GJK/providers/baseProvider'
import { getProvider } from '@GJK/providers/getProvider'


export class Joker {
  provider:BaseProvider

  constructor(opts:TJokerOpts) {
    this.provider = getProvider(opts.provider)

  }

}
