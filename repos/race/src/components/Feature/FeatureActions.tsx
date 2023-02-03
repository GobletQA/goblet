import { Section } from '../Section'
import { SectionActions } from '../Section/SectionActions'
import { useEditor } from '../../contexts'
import { ESectionType } from '@GBR/types'
import { FeatureAdd } from '../Actions/AddFeature'

import { addRule } from '@GBR/actions/rule/addRule'
import { addBackground } from '@GBR/actions/background'
import { addScenario } from '@GBR/actions/scenario/addScenario'
import {
  HeaderText,
  FeatureActionsContainer
} from './Feature.styled'

import {
  TabPlusIcon,
  CardPlusIcon,
  PlaylistPlusIcon,
} from '@gobletqa/components'

export type TFeatureActions = {}

const styles = {
  section: {
    marginTop: `-20px`,
    marginLeft: `-20px`,
    marginRight: `-20px`,
    marginBottom: `20px`,
    backgroundColor: `transparent`,
    paddingTop: `2px`,
    paddingBottom: `2px`, 
    borderBottom: `1px solid #111111`,
    [`& .MuiAccordionSummary-root`]: {
      backgroundColor: `transparent !important`,
    }
  },
  header: {
    [`& h5`]: {
      fontSize: `18px`
    }
  },
  actions: {
    opacity: 1,
  }
}

export const FeatureActions = (props:TFeatureActions) => {
  const { feature } = useEditor()

  return (
    <FeatureActionsContainer>
      <HeaderText>
        Feature
      </HeaderText>
      <SectionActions
        sx={styles.actions}
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
              onClick={addScenario}
              Icon={PlaylistPlusIcon}
              type={ESectionType.scenario}
              key={`gr-feature-scenario-action`}
            />
          ),
        ]}
      />
    </FeatureActionsContainer>
  )

}