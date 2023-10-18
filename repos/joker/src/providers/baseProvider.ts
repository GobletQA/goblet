import type {
  TPrompt,
  TQuestion,
  TProviderDefs,
  TProviderOpts,
} from '@GJK/types'

import { isStr } from '@keg-hub/jsutils/isStr'
import { EAIModel, EPromptRole, EAIProvider } from '@GJK/types'

const throwOverrideErr = (message?:string) => {
  throw new Error(message || `Provider method must be overrides by an extending Class`)
}

export class BaseProvider {
  name:EAIProvider
  defaults:TProviderDefs = {
    top_p: 0.90,
    max_tokens: 256,
    temperature: 0.0,
    model: EAIModel.GPT3T
  }

  constructor(opts:TProviderOpts){
    this.name = opts.name
    this.defaults = {...this.defaults, ...opts.defaults}
  }

  protected toPrompt = (question:TQuestion) => {
    const { messages } = question
    
    const msgs = messages.map(message => {
      return isStr(message)
        ? { role: EPromptRole.user, content: message }
        : { role: EPromptRole.user, ...message }
    })

    return {
      ...this.defaults,
      ...question,
      messages: msgs
    } as TPrompt
  }

  findIn = async (query?:string, items?:string[]) => {
    throwOverrideErr()
    return undefined
  }

  prompt = async (question:TQuestion) => {
    throwOverrideErr()
    return undefined
  }

}

