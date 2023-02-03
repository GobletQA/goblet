
import { useEditor } from '../../contexts'
import { FeatureMenu } from './FeatureMenu'
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
  actions: {
    opacity: 1,
  }
}

const menuItems = [
  {
    Icon:CardPlusIcon,
    onClick:addBackground,
    text: `Add Background`,
  },
  {
    text: `Add Rule`,
    onClick: addRule,
    Icon: TabPlusIcon,
  },
  {
    text: `Add Scenario`,
    onClick: addScenario,
    Icon: PlaylistPlusIcon,
  },
]

export const FeatureActions = (props:TFeatureActions) => {
  const { feature } = useEditor()

  return (
    <FeatureActionsContainer>
      <HeaderText>
        Feature
      </HeaderText>
      <FeatureMenu items={menuItems} />
    </FeatureActionsContainer>
  )

}