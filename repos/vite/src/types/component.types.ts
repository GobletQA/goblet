import type { ComponentType, ReactNode } from 'react'
import type { SxProps, SystemStyleObject } from '@mui/system'
import type { Theme } from '@mui/material'

// SystemStyleObject<Theme>
// ((theme: Theme) => SystemStyleObject<Theme>)
// ReadonlyArray<boolean | SystemStyleObject<Theme> | ((theme: Theme) => SystemStyleObject<Theme>)>;

export type CssProps = SxProps<Theme>
export type CSSObj = SystemStyleObject<Theme>


export type TRenderComp = (...args:any[]) => ReactNode
export type InputDecor = {
  pos?: `start` | `end`
  children?: ReactNode
  onClick?:(evt:Event) => void
  onHover?:(evt:Event) => void
  Component?: TRenderComp
  [key: string]: any
}

