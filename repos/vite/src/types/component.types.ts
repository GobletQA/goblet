import type { ComponentType, ReactNode } from 'react'
import type { Theme } from '@mui/material'
import type { SxProps, SystemStyleObject } from '@mui/system'

// SystemStyleObject<Theme>
// ((theme: Theme) => SystemStyleObject<Theme>)
// ReadonlyArray<boolean | SystemStyleObject<Theme> | ((theme: Theme) => SystemStyleObject<Theme>)>;

export type TStyle = Record<string, string|number>
export type TStyles = Record<string, TStyle>

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

