import type Monaco from 'monaco-editor'
import type { EDefinitionVariant } from './shared.types'
import type { Range, TextEdit } from 'vscode-languageserver-types'
import type { editor as Editor, languages as Languages } from 'monaco-editor'

interface Constructor<T> extends Function {
    new (...args: unknown[]): T
    prototype: T
}
type Factory<T> = (...args: unknown[]) => T
type TRegexps = RegExp[] | string[] | RegExp | string

export type IEditor = Editor.IStandaloneCodeEditor | null

export type TMonaco = typeof Monaco


export class ParameterType<T> {
    name?:string
    type:Constructor<T> | Factory<T> | string | null
    useForSnippets:boolean=false
    preferForRegexpMatch:boolean=false
    private transformFn:any = () => {}
    static compare = (pt1: ParameterType<unknown>, pt2: ParameterType<unknown>): number => { return 0}
    static checkParameterTypeName = (typeName: string): void => {}
    static isValidParameterTypeName = (typeName: string): boolean => { return false }
    regexpStrings:string[]=[]
    constructor(
      name: string | undefined,
      regexps: TRegexps,
      type: Constructor<T> | Factory<T> | string | null,
      transform: (...match: string[]) => T | PromiseLike<T>,
      useForSnippets: boolean,
      preferForRegexpMatch: boolean
    ){
      this.name = name
      this.type = type
      this.transformFn = transform
      this.useForSnippets = useForSnippets
      this.preferForRegexpMatch = preferForRegexpMatch
      this.regexpStrings = !regexps
        ? []
        : Array.isArray(regexps)
          ? regexps.map(exp => exp.toString())
          : [regexps].map(exp => exp.toString())
    }
    transform = (thisObj: unknown, groupValues: string[] | null): any => {}
}

export class Group {
  readonly value: string
  readonly start: number | undefined
  readonly end: number | undefined
  readonly children: readonly Group[]
  constructor(value: string, start: number | undefined, end: number | undefined, children: readonly Group[]){
    this.value = value
    this.children = children
  }
  values = (): string[] | null => { return null }
}

export class Argument {
  readonly group: Group
  readonly parameterType: ParameterType<unknown>
  static build = (group: Group, parameterTypes: readonly ParameterType<unknown>[]):Argument[] => {
    return []
  }
  constructor(group: Group, parameterType: ParameterType<unknown>){
    this.group = group
    this.parameterType = parameterType
  }
  getValue = <T>(thisObj: unknown): T | null => {
    return (thisObj as any)?.value as T
  }
  getParameterType = (): ParameterType<unknown> => {
    return new ParameterType<unknown>(
      undefined,
      [],
      `unknown`,
      () => {},
      true,
      false
    )
  }
}

export type TExpression = {
  source: string
  match: (text: string) => Argument[] | null
}


export type TMonacoDefinition = {
  suggestion: string
  segments: string[] | RegExp[]
  expression: EDefinitionVariant
}

export type TIndex = (text: string) => TMonacoDefinition[]


export {
  Range as TRange,
  Editor as NEditor,
  TextEdit as TTextEdit,
  Languages as NLanguages
}