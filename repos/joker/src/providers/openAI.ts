import type { TProviderOpts } from '@GJK/types'

import OpenAISdk from 'openai'
import { ENVS } from '@gobletqa/environment'
import { BaseProvider } from './baseProvider'

export class OpenAI extends BaseProvider {
  ai:OpenAISdk

  constructor(opts:TProviderOpts){
    super(opts)
    this.ai = new OpenAISdk({
      apiKey: opts?.auth?.apiKey || ENVS.GB_OPEN_AI_KEY,
      organization: opts?.auth?.organization || ENVS.GB_OPEN_AI_ORG_ID,
    })
  }

  findIn = async (query?:string, items?:string[]) => {
    return undefined
  }

}
