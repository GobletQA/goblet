import {ReactNode} from "react"

export type TKeyboardCtx = {
  keyboard: TKeyboard
  setKeyboard:(keyboard:TKeyboard) => void
}

export type TExKey = `alt`|`ctrl`|`meta`|`shift`

export type TKeyConfig = {
  key?:string
  code?:string
  stop?:boolean
  keyCode?:number
  combo?:TExKey[],
  prevent?:boolean
  action:(evt:KeyboardEvent) => void
}

export type TKeyboard = {
  active?:boolean
  a?:TKeyConfig
  b?:TKeyConfig
  c?:TKeyConfig
  d?:TKeyConfig
  e?:TKeyConfig
  f?:TKeyConfig
  g?:TKeyConfig
  h?:TKeyConfig
  i?:TKeyConfig
  j?:TKeyConfig
  k?:TKeyConfig
  l?:TKeyConfig
  m?:TKeyConfig
  n?:TKeyConfig
  o?:TKeyConfig
  p?:TKeyConfig
  q?:TKeyConfig
  r?:TKeyConfig
  s?:TKeyConfig
  t?:TKeyConfig
  u?:TKeyConfig
  v?:TKeyConfig
  w?:TKeyConfig
  x?:TKeyConfig
  y?:TKeyConfig
  z?:TKeyConfig
  escape?:TKeyConfig
}
export type TKeyboardProvider = {
  children: ReactNode
}