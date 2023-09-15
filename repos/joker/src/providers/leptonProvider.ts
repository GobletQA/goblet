import type { TProviderOpts, TQuestion, TPromptResp } from '@GJK/types'

import OpenAISdk from 'openai'
import { BaseProvider } from './baseProvider'

export class LeptonAI extends BaseProvider {
  ai:OpenAISdk

  constructor(opts:TProviderOpts){
    super(opts)
    this.ai = new OpenAISdk(opts?.auth)
  }

  findIn = async (query?:string, items?:string[]) => {
    return undefined
  }

  prompt = async (question:TQuestion):Promise<TPromptResp> => {
    const prompt = this.toPrompt(question) as any
    // console.log(`Question:`, require('util').inspect(prompt, false, null, true))
    const completion = await this.ai.chat.completions.create(prompt)
    // console.log(`Answer:`, require('util').inspect(completion, false, null, true))

    return completion
  }

}
