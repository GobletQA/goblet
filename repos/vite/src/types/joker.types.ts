import {ReactNode} from "react"

import {
  TJokerRes,
  EJokerAction,
  EJokerMessageType,
  TJokerReq as TJokerReqEx,
} from './shared.types'
import {TSocketEvt} from "./socket.types"

export type TJokerMessageId = string|number
export type TTimestamp = number

export type TJokerAction = {
  label:string
  id:string|number
  kind:EJokerAction
  key?:string|number
  variant?:`outlined`|`text`|`contained`
}

export type TJokerMessage = {
  text:ReactNode
  key?:string|number
  id:TJokerMessageId
  type:EJokerMessageType
  actions?:TJokerAction[]
  requestId?:TJokerMessageId
}


export type TJokerUsage = {
  prompt_tokens?:number
  total_tokens?:number
  completion_tokens?:number
}

export type TJokerStepReq = TJokerReq<{ url: string }> & {
  action: EJokerAction.StepFromBrowserAndPrompt
}

export type TJokerQAReq = TJokerReq<never> & {
  action: EJokerAction.Question
}

export type TJokerReq<T extends Record<string, any>=Record<string, any>> = TJokerReqEx<T> & {
  cb?:(res:TJokerSocketRes) => void
}

export type TJokerSocketRes = TSocketEvt<TJokerRes>

