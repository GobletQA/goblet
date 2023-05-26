import type { TRaceFeature } from '@GBR/types'
import type { TMenuItem } from '@gobletqa/components'

import { noOp } from '@keg-hub/jsutils'
import { addRule } from '@GBR/actions/rule/addRule'
import { ESectionExt, ESectionType } from '@GBR/types'
import { addBackground } from '@GBR/actions/background'
import { addScenario } from '@GBR/actions/scenario/addScenario'
import { toggleWorldEditor } from '@GBR/actions/general/toggleWorldEditor'
import type { ReactNode, ComponentType, MouseEvent } from 'react'


import {
  dims,
  Span,
  colors,
  WorldIcon,
  GreenText,
  StepAddIcon,
  CardPlusIcon,
  NotePlusIcon,
  AdvancedIcon,
  TextboxPlusIcon,
  PlaylistPlusIcon,
  AdvancedOutlineIcon,
  NoteMinusFilledIcon,
} from '@gobletqa/components'

export type TFeatureItem = Omit<TMenuItem, `onCloseMenu`|`closeMenu`|`onClick`|`Icon`> & {
  text:string
  description?:ReactNode
  Icon:ComponentType<any>
  key:ESectionType|ESectionExt | `mode`
  type: ESectionType|ESectionExt | `mode`
  variant?:"text" | "outlined" | "contained" | undefined
  featureKey:keyof TRaceFeature | `steps` | `general` | `world` | `mode`
  onClick: (evt:MouseEvent<HTMLElement>, featureId:string, featureType:string) => void
}

const activeStyles = {
  sx: {
    color: colors.green10,
    transition: `color ${dims.trans.avgEase}`,
    [`&:hover`]: {
      color: colors.purple10
    }
  }
}

export const GeneralItem:TFeatureItem = {
  onClick: noOp,
  Icon: NotePlusIcon,
  text: `Feature Metadata`,
  featureKey: `general`,
  key: ESectionExt.general,
  type: ESectionExt.general,
  tooltip: {
    loc: `right`,
    title: `Show Feature Metadata`,
  },
  description: (
    <Span>
      <b>General</b> - used to define a general information about the Feature and its purpose.
      <br/>
      &nbsp;&nbsp;• This section is commonly used to define a <GreenText>User Story</GreenText> which sets direction for the Steps within the Feature.
    </Span>
  ),
}

export const GeneralItemActive = {
  ...GeneralItem,
  ...activeStyles,
  text: `Feature Metadata`,
  Icon: NoteMinusFilledIcon,
  tooltip: {
    loc: `right`,
    title: `Hide Feature Metadata`,
  },
}

export const ScenarioItem:TFeatureItem = {
  text: `Add Scenario`,
  Icon: PlaylistPlusIcon,
  featureKey: `scenarios`,
  key: ESectionType.scenario,
  type: ESectionType.scenario,
  onClick:(_:any, parentId:string) => addScenario({ parentId }),
  description: (
    <Span>
      <b>Scenario</b> - a specific example of how the feature should behave in a particular situation. Defined by a list of steps that describe the process to achieve the desired outcome. A Scenario is a key section of a feature file, and is used to ensure it works as expected.
      <br/>
      &nbsp;&nbsp;• The <GreenText>Scenario</GreenText> keyword is synonymous with the keyword <GreenText>Example</GreenText>.
    </Span>
  )
}

export const RuleItem:TFeatureItem = {
  text: `Add Rule`,
  onClick: () => addRule(),
  featureKey: `rules`,
  Icon: TextboxPlusIcon,
  key: ESectionType.rule,
  type: ESectionType.rule,
  description: (
    <Span>
      <b>Rule</b> - an optional section used to group scenarios under a single theme or purpose. It can provide additional context and information about its parent Feature and or child Scenarios.
      <br/>
      &nbsp;&nbsp;• A <GreenText>Rule</GreenText> can be through of as a group of Scenarios that illustrate a particular outcome within a Feature.
    </Span>
  )
}

export const BackgroundItem:TFeatureItem = {
  Icon:CardPlusIcon,
  text: `Add Background`,
  featureKey: `background`,
  key: ESectionType.background,
  type: ESectionType.background,
  onClick:(_:any, parentId:string) => addBackground({ parentId }),
  description: (
    <Span>
      <b>Background</b> - used to define a list of one or more Steps that are executed prior to each Scenario.
      <br/>
      &nbsp;&nbsp;• This allows for defining common Steps of Scenarios in a single location and reduce duplication.
    </Span>
  )
}

export const StepItem:TFeatureItem = {
  text: `Add Step`,
  Icon: StepAddIcon,
  featureKey: `steps`,
  key: ESectionType.step,
  type: ESectionType.step,
  onClick: noOp,
  description: (
    <Span>
      <b>Step</b> - a condition to be set, or an action to be performed in order to achieve the desired outcome of a Scenario. Steps are the building blocks of a Scenario and provide a clear, concise description of the behavior being tested.
      <br/>
      &nbsp;&nbsp;• A Step starts with a keyword <GreenText>Given</GreenText>, <GreenText>When</GreenText>, or <GreenText>Then</GreenText> and is followed by a natural language description of the action or condition.
    </Span>
  )
}


export const WorldItem:TFeatureItem = {
  Icon: WorldIcon,
  featureKey: `world`,
  key: ESectionExt.world,
  type: ESectionExt.world,
  text: `Open World Editor`,
  onClick: () => toggleWorldEditor()
}

export const ModeItem:TFeatureItem = {
  key: `mode`,
  type: `mode`,
  onClick: noOp,
  featureKey: `mode`,
  text: `Advanced Mode`,
  Icon: AdvancedOutlineIcon,
  tooltip: {
    loc: `right`,
    title: `Enable Advanced mode`,
  },
}

export const ModeItemActive:TFeatureItem = {
  ...ModeItem,
  ...activeStyles,
  Icon: AdvancedIcon,
  tooltip: {
    loc: `right`,
    title: `Disabled Advanced mode`,
  },
}


export const FeatureItems:TFeatureItem[] = [
  RuleItem,
  WorldItem,
  GeneralItem,
  ScenarioItem,
  BackgroundItem,
]