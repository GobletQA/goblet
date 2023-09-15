import type { EAIModel } from "./models.types"

export enum EAIProvider {
  JokerAI=`JokerAI`,
  OpenAI=`OpenAI`,
  LeptonAI=`LeptonAI`,
  IntelliNode=`IntelliNode`,
}

export type TProviderDefs = {
  model:EAIModel
  top_p?:number
  max_tokens?:number
  temperature?:number
}

export type TProviderOpts = {
  name:EAIProvider
  auth?:Record<string, any>
  defaults?:TProviderDefs
}
