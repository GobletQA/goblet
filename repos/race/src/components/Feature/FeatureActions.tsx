import type { TRaceFeature, TFeaturesRef } from '@GBR/types'

import { Section } from '../Shared'
import { useEditor } from '../../contexts'
import { ESectionType } from '@GBR/types'
import { Add } from '../Actions/Add'

import { addRule } from '@GBR/actions/rule/addRule'
import { addBackground } from '@GBR/actions/background'
import { addScenario } from '@GBR/actions/scenario/addScenario'

import {
  Span,
  Label,
  TabPlusIcon,
  CardPlusIcon,
  ListPlusIcon,
  TrayPlusIcon,
  ShapesPlusIcon,
  PlaylistPlusIcon,
} from '@gobletqa/components'


export type TFeatureActions = {
  
}

const Act = (args:any) => {
  const { text, Icon } = args

  return (props:any) => {
    return (
      <Span>
        <Icon {...props} />
        <Label>
          {text}
        </Label>
      </Span>
    )
  }
}

export const FeatureActions = (props:TFeatureActions) => {
  const { feature } = useEditor()
  
  return (
    <Section
      show={true}
      noToggle={true}
      parent={feature}
      label={` `}
      initialExpand={true}
      type={ESectionType.feature}
      id={`feature-${feature.uuid}-actions`}
      className='gr-feature-actions-container'
      dropdownSx={{ marginBottom: `0px !important` }}
      // TODO: fix this to display properly
      actions={[
        Add({
          onClick: addBackground,
          type: ESectionType.background,
          Icon: Act({ text: `Background`, Icon: CardPlusIcon }),
        }),
        Add({
          onClick: addRule,
          type: ESectionType.rule,
          Icon: Act({ text: `Rule`, Icon: TabPlusIcon })
        }),
        Add({
          onClick: addScenario,
          type: ESectionType.scenario,
          Icon: Act({ text: `Scenario`, Icon: PlaylistPlusIcon })
        })
      ]}
    >

    </Section>
  )
  
}