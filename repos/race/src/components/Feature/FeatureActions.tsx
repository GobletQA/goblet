import { Section } from '../Shared'
import { useEditor } from '../../contexts'
import { ESectionType } from '@GBR/types'
import { FeatureAdd } from '../Actions/AddFeature'

import { addRule } from '@GBR/actions/rule/addRule'
import { addBackground } from '@GBR/actions/background'
import { addScenario } from '@GBR/actions/scenario/addScenario'

import {
  TabPlusIcon,
  CardPlusIcon,
  PlaylistPlusIcon,
} from '@gobletqa/components'

export type TFeatureActions = {}

export const FeatureActions = (props:TFeatureActions) => {
  const { feature } = useEditor()
  
  return (
    <Section
      show={true}
      noToggle={true}
      parent={feature}
      label={`Feature Sections`}
      initialExpand={true}
      type={ESectionType.feature}
      id={`feature-${feature.uuid}-actions`}
      className='gr-feature-actions-container'
      dropdownSx={{ marginBottom: `0px !important` }}
      actions={[
        (
          <FeatureAdd
            Icon={CardPlusIcon}
            onClick={addBackground}
            type={ESectionType.background}
            key={`gr-feature-background-action`}
            disabled={Boolean(feature.background)}
          />
        ),
        (
          <FeatureAdd
            onClick={addRule}
            Icon={TabPlusIcon}
            type={ESectionType.rule}
            key={`gr-feature-rule-action`}
          />
        ),
        (
          <FeatureAdd
            Icon={PlaylistPlusIcon}
            onClick={addScenario}
            type={ESectionType.scenario}
            key={`gr-feature-scenario-action`}
          />
        ),
      ]}
    >

    </Section>
  )
  
}