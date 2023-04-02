import type { CSSProperties } from 'react'

export type TEvtCallback = (event:any, ...args:any[]) => any

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

export type TTextType = `inherit`
  | `h1`
  | `h2`
  | `h3`
  | `h4`
  | `h5`
  | `h6`
  | `subtitle1`
  | `subtitle2`
  | `body1`
  | `body2`
  | `caption`
  | `button`
  | `overline`
  | undefined

export type TColorType = `inherit`
  | `primary`
  | `secondary`
  | `success`
  | `error`
  | `info`
  | `warning`
  | undefined
