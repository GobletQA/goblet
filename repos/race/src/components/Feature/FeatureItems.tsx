import type { ReactNode, ComponentType, ComponentProps } from 'react'

import { ESectionType, TRaceFeature } from '@GBR/types'
import { addRule } from '@GBR/actions/rule/addRule'
import { addBackground } from '@GBR/actions/background'
import { addScenario } from '@GBR/actions/scenario/addScenario'

import {
  Span,
  colors,
  CardPlusIcon,
  TextboxPlusIcon,
  PlaylistPlusIcon,
} from '@gobletqa/components'

export type TFeatureItems = {
  text:string
  type:ESectionType
  description?:ReactNode
  Icon: ComponentType<any>
  onClick:(...args:any[]) => any
  featureKey:keyof TRaceFeature
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

export const FeatureItems:TFeatureItems[] = [
  {
    Icon:CardPlusIcon,
    onClick:addBackground,
    text: `Add Background`,
    featureKey: `background`,
    type: ESectionType.background,
    description: (
      <>
        <b>Background</b> - an optional section used to define a list of one or more steps. The steps of a Background are executed prior to each Scenario defined in a Feature. This allows for defining common steps in a single location which helps to reduce duplication between Scenarios.
      </>
    )
  },
  {
    text: `Add Rule`,
    onClick: addRule,
    featureKey: `rules`,
    Icon: TextboxPlusIcon,
    type: ESectionType.rule,
    description: (
      <>
        <b>Rule</b> - an optional section used to group scenarios under a single theme or purpose. It can provide additional context and information about its parent feature and or child scenarios. A rule can be through of as a group of scenarios that illustrate a particular outcome within a feature.
      </>
    )
  },
  {
    text: `Add Scenario`,
    onClick: addScenario,
    Icon: PlaylistPlusIcon,
    featureKey: `scenarios`,
    type: ESectionType.scenario,
    description: (
      <>
        <b>Scenario</b> - used to define a list of of one or more steps that describe a particular outcome of a feature. The steps typically follow a <GreenText>Given</GreenText>, <GreenText>When</GreenText> and <GreenText>Then</GreenText> pattern, which allows for defining instructions in a clear and concise way.
        <br/>
        <br/>
        &nbsp;&nbsp;- The Scenario keyword is synonymous with the keyword <GreenText>Example</GreenText>.
      </>
    )
  },
]
