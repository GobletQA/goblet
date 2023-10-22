import { EAIModel } from './models.types'

export enum  EPromptRole {
  user=`user`,
  system=`system`,
  assistant=`assistant`,
  function=`function`,
}

export type TJokerMsg = {
  content:string
  role:EPromptRole.assistant|EPromptRole.function
}

export type TUserMsg = {
  content:string
  role:EPromptRole.user
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
  id:string
  model?: EAIModel
  messages:TQMsg[]
  temperature?:number
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
  message: TJokerMsg,
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