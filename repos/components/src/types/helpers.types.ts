import type { CSSProperties } from 'react'

export type TEvtCallback = (event:any) => any

export type TIcon = {
  title?: string
  size?: string
  height?: string
  width?: string
  color?:string
  fill?:string
  className?:string
  style?: CSSProperties
  svgStyle?: CSSProperties
}