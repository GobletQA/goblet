import type { TProviderOpts, TQuestion, TPromptResp } from '@GJK/types'

import { BaseProvider } from './baseProvider'

export class EmptyProvider extends BaseProvider {

  constructor(opts:TProviderOpts){
    super(opts)
  }

  findIn = async (query?:string, items?:string[]) => {
    return undefined
  }

  prompt = async (question:TQuestion):Promise<TPromptResp> => {
    return {
      model:``,
      object:``,
      created: 0,
      choices: [],
      id:`Provider-Not-Initialize`,
    }
  }

}
