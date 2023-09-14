import type { TProviderOpts, TPromptOpts } from '@GJK/types'
import type { OpenAI } from 'openai'

import OpenAISdk from 'openai'
import { ENVS } from '@gobletqa/environment'
import { BaseProvider } from './baseProvider'

type TComps = OpenAI[`completions`]

export class LeptonAI extends BaseProvider {
  ai:OpenAISdk

  constructor(opts:TProviderOpts){
    super(opts)
    this.ai = new OpenAISdk({
      baseURL: opts?.auth?.baseURL || ENVS.GB_LEPTON_AI_URL,
      apiKey: opts?.auth?.apiKey || ENVS.GB_LEPTON_AI_TOKEN,
    })
  }

  findIn = async (query?:string, items?:string[]) => {
    return undefined
  }

  prompt = async (prompt:string, opts?:TPromptOpts) => {
    const built = this.buildPrompt(prompt, opts) as any

    const completion = await this.ai.chat.completions.create({
      messages: [built],
      model: 'gpt-3.5-turbo',
    })

    console.log(completion.choices)
  }


}

