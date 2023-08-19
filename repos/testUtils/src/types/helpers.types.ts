import type { TWorldConfig } from '@ltipton/parkin'
import type { TLocator, TBrowserPage } from './shared.types'

export type TClickEl = {
  save?:boolean
  selector?:string
  locator?:TLocator
  page?:TBrowserPage
  world: TWorldConfig
  worldPath?:string
}

export type TFillInput = TClickEl & {
  text:string
}

export type TSaveWorldLocator = {
  selector:string,
  worldPath?:string
  element?:TLocator
  world:TWorldConfig
}

export type TWaitFor = boolean | {
  timeout:number
  state:`visible` | `attached` | `detached` | `hidden`
}