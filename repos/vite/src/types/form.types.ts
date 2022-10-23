import type { Dispatch, SetStateAction } from 'react'
import type { ComponentType } from 'react'
import type { TInputDecor } from '@types'
import type { TextFieldProps, GridProps } from '@mui/material'
import type { FormComponents } from '@components/Form'

export type THFormHelpers = {
  onSuccess?:(data:any) => any
}

export type THFormHelpersResp = {
  isLoading:boolean
  loadingError: string
  onSuccess: (...args:any[]) => any,
  setIsLoading: Dispatch<SetStateAction<boolean>>
  setLoadingError: Dispatch<SetStateAction<string>>
}


export type TFormRootProps = GridProps & {
  Component?: ComponentType<any>
}

export type TFormRef = {
  name: string
  values: Record<any, any>
}

export type TBuildFormOpts = Omit<TFormRef, 'name'> & THFormHelpers & {
  pathValues: Record<string, any>
}

export type TBuildFieldRules = {
  [key: string]: any
}

export type TBuildFormField = {
  name: string,
  label?: string,
  active?: boolean|string
  disabled?: boolean|string
  required?: boolean|string,
  placeholder?: string
  decor?: TInputDecor,
  rules?: TBuildFieldRules
  Grid?: ComponentType<any>
  gridOptions?: GridProps
  textFieldProps?: TextFieldProps
  Component?: ComponentType<any> | keyof typeof FormComponents
  [key:string]: any
}

export type TFormFields = Record<string, TBuildFormField>

export type TBuildFormObj = {
  form: TFormRef
  $root: TFormRootProps
  $actions?: TFormActions
  fields: TFormFields
}

export type TFormAction = {
  onClick?: (...args:any[]) => void
  text?: string
  label?: string
  [key:string]: any
}

export type TFormActions = {
  [key:string]: TFormAction
}

export type TBuiltForm = Record<'form', Omit<TFormRef, 'name'>>
  & Record<'$root', TFormRootProps>
  & Record<'$actions', TFormActions>
  & Record<string, TBuildFormField>

export type TOptFunc = (val:any) => any