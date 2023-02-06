import type { TBackgroundAst, TScenarioAst, TStepAst } from '@gobletqa/shared'


export type TResizeSideBarEvent = {
  size?: number
  toggle?:boolean
}

export type TSelectFromBrowserEvent = {
  parent:TBackgroundAst | TScenarioAst
  step: TStepAst
  expression: {
    kind?: string
    value?:unknown
    index:number
    input:string
    text: string
    regex: RegExp
    type: string
    example?: string
    paramType: string
    description?: string,
  }
}

export type TSelectFromBrowserRespEvent = {
  type: string,
  target: string,
  elementTag: string,
  elementHtml: string
}
