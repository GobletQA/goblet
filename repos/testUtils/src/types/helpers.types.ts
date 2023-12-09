import type { TGBWorldCfg, TLocator, TBrowserPage, TFrameLocator } from './shared.types'

export type TClickOpts = {
  delay?:number
  force?:boolean
  trial?:boolean
  timeout?:number
  clickCount?:number
  noWaitAfter?:boolean
  button?:`left`|`right`|`middle`
  position?:{ x:number, y:number }
  modifiers?:Array<`Alt`|`Control`|`Meta`|`Shift`>
}

export type TClickEl = TClickOpts & {
  save?:boolean
  selector?:string
  locator?:TLocator
  worldPath?:string
  parent?:TBrowserPage|TFrameLocator
}

export type TGetIframe = {
  iframe:string
}

export type TGetIframeLocator = {
  iframe?:string
  selector:string
  frame?:TFrameLocator
}

export type TFillInput = TClickEl & {
  text:string
}

export type TSaveWorldLocator = {
  selector:string,
  worldPath?:string
  element?:TLocator
  world:TGBWorldCfg
}

export type TLocOpts = {
  has?:TLocator
  hasNot?:TLocator
  hasText?:string
  hasNotText?:string
  parent?:TBrowserPage|TFrameLocator
}

export type TWaitFor = {
  timeout:number
  state:`visible` | `attached` | `detached` | `hidden`
}

export type TDragToOpts = {
  force?:boolean
  trial?:boolean
  timeout?:number
  noWaitAfter?:boolean
  sourcePosition?:Object
  targetPosition?:Object
}
