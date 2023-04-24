import type { MouseEvent } from 'react'
import type { EAstObject } from '@ltipton/parkin'
import type { TExpPart } from './expressions.types'
import type { TOnMenuClose, TOnMenuOpen, TMenuItem } from '@gobletqa/components'
import type { TFeatureCtx, TParkinCtx, TStepDefsCtx } from '@GBR/contexts'
import type {
  TRaceRule,
  TRaceStep,
  TRaceFeature,
  TRaceScenario,
  TRaceBackground,
} from './features.types'
import { TAudit } from './audit.types'

import type { ComponentProps, ReactNode, ComponentType } from 'react'

export type TOnSubMenu = {
  open?:boolean
  items:TMenuItem[],
  closeParent?:boolean
}

export type TRaceMenuItemClickCtx = Omit<TMenuContextRef, 'context'>
  & TParkinCtx
  & TStepDefsCtx
  & Omit<TFeatureCtx, `setFeature`>
  & {
    open:boolean
    audit: TAudit
    onOpen:TOnMenuOpen
    onClose:TOnMenuClose
    setOpen:(open:boolean) => void
    onChange:(...args:any[]) => any
    onSubmenu:(event:MouseEvent<HTMLElement>, data:TOnSubMenu) => void
  }

export type TRaceMenuItemClick = (
  ctx:TRaceMenuItemClickCtx,
  evt: MouseEvent<HTMLElement>
) => any

export type TRaceMenuItem = {
  id?:string
  key?:string
  type:EAstObject
  text?:ReactNode
  label?:ReactNode
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
  type: EAstObject
  context?:keyof TRaceContextMenu
  setInputProps:TMenuContextSetInputProps
  gran: TRaceFeature | TRaceBackground | TRaceRule | TRaceScenario
  parent: TRaceFeature | TRaceBackground | TRaceRule | TRaceScenario | TRaceStep
  // TODO: look into adding other types as needed
  // active: TExpPart | TRaceBackground | TRaceRule | TRaceScenario | TRaceStep | TRaceBlock
  active: TExpPart
}