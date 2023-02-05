import type { Theme } from '@mui/material'
import type { SxProps, SystemStyleObject } from '@mui/system'


export type CSSProps = SxProps<Theme>
export type CSSObj = SystemStyleObject<Theme>


export type TAutoOpt = {
  label: string
  id: string | number
}
export type TAutoOptVal = string | TAutoOpt

