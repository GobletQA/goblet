import type { TSymAST } from './shared.types'


export type TGlobalCopyEvent = {
  text: string
}

export type TBrowserNavEvt = {
  url:string
  ast?:TSymAST[]
}

export type TBrowserIsLoadedEvent = {
  state:boolean
}