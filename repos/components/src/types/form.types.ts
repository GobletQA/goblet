import type {
  ReactNode,
  ComponentType,
  CSSProperties,
} from 'react'

export type TInputDecor = {
  name: string
  label?: string
  labelSx?: CSSProperties
  labelPos?:string
  pos?: `start` | `end`
  children?: ReactNode
  active?: boolean|string
  disabled?: boolean|string
  onClick?:(evt:Event) => void
  onHover?:(evt:Event) => void
  iconProps?: Record<any, any>
  Icon?: ComponentType<any> | string
  Component?: ComponentType<any> | string
  [key: string]: any
}


export type TChangeCB = (evt?:any, value?:TInputValue) => void
export type TToggleEditCB = (evt?:any, value?:TInputValue, editing?:boolean) => void

export type TInputValue = string|number|boolean|string[]

export type TOptionLabelCB = (option:string|string[]|Record<string, any>) => string