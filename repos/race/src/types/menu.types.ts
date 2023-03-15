import type { MouseEvent } from 'react'
import type { TExpPart } from './steps.types'
import type { ESectionType } from './section.types'
import type { TFeatureCtx, TParkinCtx, TStepDefsCtx } from '@GBR/contexts'
import type {
  TRaceRule,
  TRaceStep,
  TRaceBlock,
  TRaceFeature,
  TRaceScenario,
  TRaceBackground,
} from './features.types'

import type { ComponentProps, ReactNode, ComponentType } from 'react'

export type TRaceMenuItemClickCtx = Omit<TMenuContextRef, 'context'>
  & TParkinCtx
  & TStepDefsCtx
  & Omit<TFeatureCtx, `setFeature`>
  & {
    open:boolean
    setOpen:(open:boolean) => void
    onChange:(...args:any[]) => any
    onClose:(...args:any[]) => void
    onOpen:(evt: MouseEvent<HTMLElement>) => void
  }

export type TRaceMenuItemClick = (
  ctx:TRaceMenuItemClickCtx,
  evt: MouseEvent<HTMLElement>
) => any

export type TRaceMenuItem = {
  key?:string
  id?:string
  text?:ReactNode
  label?:ReactNode
  type:ESectionType
  closeMenu?:boolean
  tooltip?:ReactNode
  children?:ReactNode
  description?:ReactNode
  Icon?:ComponentType<any>
  onClick:TRaceMenuItemClick
  iconProps?:ComponentProps<any>
  featureKey?:keyof TRaceFeature
  onCloseMenu?:(...args:any[]) => any
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

export type TMenuContextSetInputProps = (props:Partial<ComponentProps<any>>) => void

export type TMenuContextRef = {
  type: ESectionType
  context?:keyof TRaceContextMenu
  setInputProps:TMenuContextSetInputProps
  gran: TRaceFeature | TRaceBackground | TRaceRule | TRaceScenario
  parent: TRaceFeature | TRaceBackground | TRaceRule | TRaceScenario | TRaceStep
  active: TExpPart | TRaceBackground | TRaceRule | TRaceScenario | TRaceStep | TRaceBlock
}