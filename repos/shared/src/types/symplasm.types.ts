
type TSymAnyAttr = Record<string, string|number>

export type TSymAttrs = TSymAnyAttr & {
  style?: Record<string, string|number|boolean|undefined|null>
}

export type TSymAST = {
  0: string
  1: TSymAttrs
  2: string|string[]|TSymAST[]
}

export type TSymParseOptCB = (...args:any[]) => any
export type TSymParseOptVal = string|number|TSymParseOptCB
export type TSymParseOptPair = Record<string, TSymParseOptVal>


export type TSymParseOpts = {
  trim?:boolean,
  root?:TSymAST,
  comments?:boolean
  parseInt?:boolean
  ignoreTags?:string[]
  parseBoolean?:boolean
  lowerCaseTag?:boolean
  attrCamelCase?:boolean
  allElements: TSymParseOptCB
  tagConvert?:TSymParseOptPair
  attrKeyAdd?:TSymParseOptPair
  attrKeyConvert?:TSymParseOptPair,
  attrValueConvert?:TSymParseOptPair,
}