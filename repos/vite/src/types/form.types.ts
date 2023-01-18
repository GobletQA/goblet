import type { Dispatch, SetStateAction } from 'react'
import type { ComponentType } from 'react'
import type { TInputDecor } from '@types'
import type { TModalFooter } from './modal.types'
import type { TextFieldProps, GridProps } from '@mui/material'
import type { FormComponents } from '@components/Form'

export type THFormHelpers = {
  onSuccess?:(data:any) => any
}

export type THFormHelpersResp = {
  loading:boolean
  formError: string
  onSuccess: (...args:any[]) => any,
  setLoading: Dispatch<SetStateAction<boolean>>
  setFormError: Dispatch<SetStateAction<string>>
}

export type TFormRootProps = GridProps & {
  Component?: ComponentType<any>
}

export type TFormRef = {
  name: string
  values: Record<any, any>
}

export type TSetupFormProps = {
  form:TBuiltForm,
  original:TBuildFormObj,
  options:TBuildFormOpts,
  formHelpers:THFormHelpersResp,
}
export type TSetupForm = (props:TSetupFormProps) => TBuiltForm

export type TBuildFormOpts = Omit<TFormRef, 'name'> & THFormHelpers & {
  setupForm?: TSetupForm
  pathValues: Record<string, any>
  [key: string]:  any
}

export type TBuildFieldRules = {
  [key: string]: any
}

export type TBuildFormField = {
  name: string,
  label?: string,
  placeholder?: string
  decor?: TInputDecor,
  gridProps?: GridProps
  active?: boolean|string
  rules?: TBuildFieldRules
  disabled?: boolean|string
  required?: boolean|string,
  Grid?: ComponentType<any>
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



// ----- NOT BUILDER
export type TFormFooter = TModalFooter & {
  
}
