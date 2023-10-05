import type { EJokerAction } from './actions.types'
import type { TProviderOpts } from './provider.types'

import type {
  TQMsg,
  TQuestion,
  TPromptMsg,
  TSystemMsg,
  TPromptResp,
} from './prompt.types'


export type TJokerOpts = {
  provider:TProviderOpts
  system?:TSystemMsg[]
}

export type TJokerAsk = Omit<TQuestion, `messages`> & {
  q?:TPromptMsg|string
  qs?:TQMsg[]
  question?:TPromptMsg|string
  questions?:TQMsg[]
}

export enum EJokerMessageType {
  User=`User`,
  Joker=`Joker`,
}


export type TJokerReq = {
  id:string
  text:string
  action?:EJokerAction
}

export type TJokerRes = TPromptResp & {
  requestId:string
}

