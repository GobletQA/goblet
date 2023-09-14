import type { EAIProvider, TProviderOpts, TPromptOpts } from '@GJK/types'

const throwOverrideErr = (message?:string) => {
  throw new Error(message || `Provider method must be overrides by an extending Class`)
}


export class BaseProvider {
  name:EAIProvider

  constructor(opts:TProviderOpts){
    this.name = opts.name
  }

  protected buildPrompt = (prompt:string=``, opts?:TPromptOpts) => {
    const content = opts?.prompt ? `${opts?.prompt}\n${prompt || ``}`.trim() : prompt.trim()

    return {
      role: `user`,
      ...opts,
      content
    }
  }

  findIn = async (query?:string, items?:string[]) => {
    throwOverrideErr()
    return undefined
  }

  prompt = async (prompt?:string, opts?:TPromptOpts) => {
    throwOverrideErr()
    return undefined
  }

}

