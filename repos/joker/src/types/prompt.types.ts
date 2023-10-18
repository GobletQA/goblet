import { EAIModel } from './models.types'

export enum  EPromptRole {
  user=`user`,
  system=`system`,
  assistant=`assistant`,
  // function=`function`,
}

export type TPromptMsg = {
  content:string
  role:EPromptRole|string
}

export type TSystemMsg = {
  content:string
  role:EPromptRole.system
}

export type TQMsg = TPromptMsg|string


export type TQuestion = {
  temperature?:number
  model?: EAIModel
  messages:TQMsg[]
}

export type TPrompt = Omit<TQuestion, `messages`> & {
  messages:TPromptMsg[]
}

export type TPRespUsage = {
  prompt_tokens:number
  total_tokens:number
  completion_tokens:number
}

export type TPRespChoice = {
  index: number,
  message: TPromptMsg,
  finish_reason: string
}

export type TPromptResp = {
  id:string
  model:string
  object:string
  created:number
  usage?:TPRespUsage
  choices:TPRespChoice[],
}