import { EAstObject } from '@ltipton/parkin'
import {
  ReactNode,
  MouseEvent,
  ComponentProps,
  ComponentType,
  CSSProperties,
} from 'react'

import {
  TRaceRule,
  TRaceStep,
  TRaceFeature,
  TRaceScenario,
  TRaceBackground,
} from './features.types'

export enum ESectionExt {
  story=`story`,
  general=`general`,
  world=`world`
}

export enum EGherkinKeys {
  rule='Rule',
  Rule='Rule',
  RULE='Rule',
  feature='Feature',
  Feature='Feature',
  FEATURE='Feature',
  background='Background',
  Background='Background',
  BACKGROUND='Background',
  scenario='Scenario',
  Scenario='Scenario',
  SCENARIO='Scenario',
}

export {
  EAstObject as ESectionType
}

export type TRaceSectionItem = TRaceRule
  | TRaceStep
  | TRaceScenario
  | TRaceFeature
  | TRaceBackground
  
export type TSectionActionMeta = {
  id?:string
  key?:string
  label?:string
  asButton?:boolean
  className?:string
  sx?:CSSProperties
  disabled?:boolean
  closeMenu?:boolean
  children?:ReactNode
  dividerTop?:boolean
  dividerBottom?:boolean
  iconProps?:ComponentProps<any>
  onClick?:(...args:any[]) => void
  Icon?:ReactNode|ComponentType<any>
  onCloseMenu?:(event: MouseEvent<HTMLElement>) => any
}