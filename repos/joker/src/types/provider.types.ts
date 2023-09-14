export enum EAIProvider {
  OpenAI=`OpenAI`,
  LeptonAI=`LeptonAI`,
  IntelliNode=`IntelliNode`,
}

export type TProviderOpts = {
  name:EAIProvider
  auth?:Record<string, any>
}

export type TPromptOpts = {
  role?:string
  prompt?:string
}