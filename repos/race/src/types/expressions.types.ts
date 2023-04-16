import type { TPartsMatch, EExpParmKind } from './shared.types'

export type TExpPart = TPartsMatch & {
  regex:RegExp
  input:string
  text:string
  type:string
  index: number
  match:string
  defIndex: number
  paramType:string
  example?: string,
  kind?: EExpParmKind
  value?:string|number
  description?: string,
}