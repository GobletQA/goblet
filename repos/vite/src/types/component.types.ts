import type { SyntheticEvent, ComponentType, ReactNode } from 'react'
import type { Theme } from '@mui/material'
import type { SxProps, SystemStyleObject } from '@mui/system'
import type {
  AutocompleteChangeReason,
  AutocompleteChangeDetails
} from '@mui/material/Autocomplete'


export type CSSProps = SxProps<Theme>
export type CSSObj = SystemStyleObject<Theme>

export type TInputDecor = {
  name: string
  label?: string
  labelSx?: CSSObj
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


export type AutoOpt = {
  label: string
  id: string | number
}
export type AutoOptVal = string | AutoOpt

export type TOnAutoChange = (
  event:SyntheticEvent,
  value:AutoOptVal|AutoOptVal[],
  reason:AutocompleteChangeReason,
  details:AutocompleteChangeDetails
) => void
