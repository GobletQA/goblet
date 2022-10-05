import type { ComponentProps, ReactNode, ChangeEvent } from 'react'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { FormLoading } from './FormLoading'
import { InputTypes } from './Inputs/InputTypes'

export enum EItemParent {
  rows = `rows`,
  sections = `sections`,
  row = `row`,
  section = `section`
}

export type TParentMeta = {
  path: string,
  type: EItemParent,
  parent: TFCRow | TFCSection
}

export type TObjectOpt = {
  key?: string
  label: any
  value: any
  [key: string|number]: any
}
export type TOptions = string[] | number[] | TObjectOpt[]

export type TFCBase = {
  id?: string
  key?: string
  name?: string
  parentKey?: string
}

export type TFCRulePattern = {
  value: string,
  message: string
}

export type TFCRule = {
  required?: boolean,
  pattern?: TFCRulePattern
}

export type TFCItem<T=Record<any, any>> = TFCBase & {
  label?: string
  value?: any
  itemProps?: T
  width?: string
  rules?: TFCRule
  disabled?: boolean
  required?: boolean
  fullWidth?: boolean
  placeholder?: string
  options?: TOptions
  type: keyof typeof InputTypes
  onChange?: (event:ChangeEvent<HTMLInputElement>) => void
}

export type TFCRow<T=ComponentProps<typeof Grid>> = TFCBase & {
  path?: string
  type?: EItemParent.row
  rowProps?: T
  RowNode?: any
  size?: number
  items?: TFCItem[]
  sections?: TFCSection[]
}

export type TFCSection<T=ComponentProps<typeof Paper>> = TFCBase & {
  path?: string
  type?: EItemParent.section
  rows?: TFCRow[]
  items?: TFCItem[]
  sectionProps?: T,
  SectionNode?: any,
  parentKey?: string
}


export type TFConfig = TFCBase & {
  rows?: TFCRow[]
  sections?: TFCSection[]
}

// R=extends React.FC<any> | React.ComponentClass<any>
export type TFormContainer = ComponentProps<typeof Grid>

export type TFormGen = {
  config: TFConfig
  RootNode?: any
  loading?: boolean
  Loading?: ReactNode
  ContainerNode?: any
  containerProps?:TFormContainer
  loadingProps?: ComponentProps<typeof FormLoading>
}

