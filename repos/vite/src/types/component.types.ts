import type { ComponentType, ReactNode } from 'react'
import type { SxProps, SystemStyleObject } from '@mui/system'
import type { Theme } from '@mui/material'

// SystemStyleObject<Theme>
// ((theme: Theme) => SystemStyleObject<Theme>)
// ReadonlyArray<boolean | SystemStyleObject<Theme> | ((theme: Theme) => SystemStyleObject<Theme>)>;

export type CSSProps = SxProps<Theme>
export type CSSObj = SystemStyleObject<Theme>

export type TInputDecor = {
  name: string
  label?: string
  labelSx?: CSSObj
  labelPos?:string
  active?: boolean|string
  disabled?: boolean|string
  children?: ReactNode
  pos?: `start` | `end`
  onClick?:(evt:Event) => void
  onHover?:(evt:Event) => void
  iconProps?: Record<any, any>
  Icon?: ComponentType<any> | string
  Component?: ComponentType<any> | string
  [key: string]: any
}

