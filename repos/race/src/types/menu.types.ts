import type { ReactNode, ComponentType } from 'react'
import type { ESectionType } from './section.types'
import type { TRaceFeature } from './features.types'


export type TRaceMenuItem = {
  key?:string
  type:ESectionType
  text?:ReactNode
  label?:ReactNode
  tooltip?:ReactNode
  description?:ReactNode
  Icon?:ComponentType<any>
  onClick:(...args:any[]) => any
  featureKey?:keyof TRaceFeature
}

export type TRaceContextMenu = {
  feature?: TRaceMenuItem[]
  general?:TRaceMenuItem[]
  story?:TRaceMenuItem[]
  background?: TRaceMenuItem[]
  rule?:TRaceMenuItem[]
  scenario?:TRaceMenuItem[]
  step?:TRaceMenuItem[]
  expression?:TRaceMenuItem[]
}
