import {ReactNode} from "react"

export type TJokerMessageId = string|number

export enum EJokerAction {
  FixFeature=`FixFeature`,
  CopyFeature=`CopyFeature`,
  GenerateFeature=`GenerateFeature`,
  CancelAction=`CancelAction`,
}


export type TJokerAction = {
  label:string
  id:string|number
  kind:EJokerAction
  key?:string|number
  variant?:`outlined`|`text`|`contained`
}

export enum EJokerMessageType {
  User=`User`,
  Joker=`Joker`,
}



export type TJokerMessage = {
  text:ReactNode
  key?:string|number
  id:TJokerMessageId
  actions:TJokerAction[]
  type:EJokerMessageType
}

export type TUpsertJokerMessage = {
  id:TJokerMessageId
  data:TJokerMessage
}