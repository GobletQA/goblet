import type { ReactNode, ComponentType, ComponentProps } from 'react'

import { noOp } from '@keg-hub/jsutils'
import { addRule } from '@GBR/actions/rule/addRule'
import { ESectionType, TRaceFeature } from '@GBR/types'
import { addBackground } from '@GBR/actions/background'
import { addScenario } from '@GBR/actions/scenario/addScenario'

import {
  Span,
  colors,
  StepAddIcon,
  CardPlusIcon,
  TextboxPlusIcon,
  PlaylistPlusIcon,
} from '@gobletqa/components'

export type TFeatureItem = {
  text:string
  key:ESectionType
  type:ESectionType
  description?:ReactNode
  Icon: ComponentType<any>
  onClick:(...args:any[]) => any
  featureKey:keyof TRaceFeature | `steps`
}

const GreenText = (props:ComponentProps<typeof Span>) => (
  <Span
    {...props}
    sx={{
      fontWeight: `bold`,
      color: colors.green10
    }}
  />
)

export const ScenarioItem:TFeatureItem = {
  text: `Add Scenario`,
  onClick: addScenario,
  Icon: PlaylistPlusIcon,
  featureKey: `scenarios`,
  key: ESectionType.scenario,
  type: ESectionType.scenario,
  description: (
    <Span>
      <b>Scenario</b> - a specific example of how the feature should behave in a particular situation. Defined by a list of steps that describe the process to achieve the desired outcome. A Scenario is a key section of a feature file, and is used to ensure it works as expected.
      <br/>
      <br/>
      &nbsp;&nbsp;• The <GreenText>Scenario</GreenText> keyword is synonymous with the keyword <GreenText>Example</GreenText>.
    </Span>
  )
}

export const RuleItem:TFeatureItem = {
  text: `Add Rule`,
  onClick: addRule,
  featureKey: `rules`,
  Icon: TextboxPlusIcon,
  key: ESectionType.rule,
  type: ESectionType.rule,
  description: (
    <Span>
      <b>Rule</b> - an optional section used to group scenarios under a single theme or purpose. It can provide additional context and information about its parent feature and or child scenarios. A rule can be through of as a group of scenarios that illustrate a particular outcome within a feature.
    </Span>
  )
}

export const BackgroundItem:TFeatureItem = {
  Icon:CardPlusIcon,
  onClick:addBackground,
  text: `Add Background`,
  featureKey: `background`,
  key: ESectionType.background,
  type: ESectionType.background,
  description: (
    <Span>
      <b>Background</b> - an optional section used to define a list of one or more steps. The steps of a Background are executed prior to each Scenario defined in a Feature. This allows for defining common steps in a single location which helps to reduce duplication between Scenarios.
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
      <br/>
      A Step starts with a keyword <GreenText>Given</GreenText>, <GreenText>When</GreenText>, or <GreenText>Then</GreenText> and is followed by a natural language description of the action or condition.
    </Span>
  )
}


export const FeatureItems:TFeatureItem[] = [
  BackgroundItem,
  RuleItem,
  ScenarioItem
]