import type Button from '@mui/material/Button'
import type DialogActions from '@mui/material/DialogActions'
import InputAdornment from '@mui/material/InputAdornment'
import type {
  AutocompleteChangeReason,
  AutocompleteChangeDetails
} from '@mui/material/Autocomplete'
import type {
  ReactNode,
  MouseEvent,
  ComponentType,
  CSSProperties,
  ComponentProps,
  SyntheticEvent,
} from 'react'

export type TAutoOpt = {
  label: string
  id: string | number
  [key:string]:any
}
export type TAutoOptVal = string | TAutoOpt

export type TOnAutoChange = (
  event:SyntheticEvent,
  value:TAutoOptVal|TAutoOptVal[],
  reason?:AutocompleteChangeReason|string,
  details?:AutocompleteChangeDetails
) => void


export type TInputVariants = `outlined`|`filled`|`standard`

export type TInputDecor = {
  decorPos?:string
  sx?: CSSProperties
  pos?: `start` | `end`
  children?: ReactNode
  Component?: ComponentType<any> | string
  adornmentProps: Partial<ComponentProps<typeof InputAdornment>>
  [key: string]: any
}

export type TChangeCB = (evt?:any, value?:TInputValue|undefined) => any
export type TToggleEditCB = (evt?:any, value?:TInputValue, editing?:boolean) => void

export type TInputValue = string|number|boolean|string[]

export type TOptionLabelCB = (option:string|string[]|Record<string, any>) => string

type TToggleOpt = {
  value:string
  text:string
}

export type TOnToggle = (event: MouseEvent<HTMLElement>, value:string) => void

export type TToggle = {
  color?:string
  label?:string
  exclusive?:boolean
  onChange?:TOnToggle
  value?: string|TToggleOpt
  options:string[]|TToggleOpt[]
  sx?:CSSProperties
  labelSx?:CSSProperties
  toggleSx?:CSSProperties
  toggleGrpSx?:CSSProperties
}

export type TFormActions = {
  [key:string]: TFormAction
}

export type TFormAction = Omit<ComponentProps<typeof Button>, `onClick` | `color` | `variant`> & {
  text?: string
  label?: string
  loading?: boolean
  EndIcon?: ComponentType<any>
  StartIcon?: ComponentType<any>
  iconProps?: ComponentProps<any>
  onClick?: (...args:any[]) => void
}

export type TFormFooter = {
  sx?:CSSProperties
  children?: ReactNode
  actionProps?: ComponentProps<typeof DialogActions>
  actions?: TFormAction[] | Record<string, TFormAction>
}
