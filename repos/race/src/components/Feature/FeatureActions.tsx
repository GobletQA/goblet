import { useMemo } from 'react'
import { FeatureMenu } from './FeatureMenu'
import { addRule } from '@GBR/actions/rule/addRule'
import { useSettings, useEditor } from '@GBR/contexts'
import { addBackground } from '@GBR/actions/background'
import { addScenario } from '@GBR/actions/scenario/addScenario'
import {
  HeaderText,
  FeatureActionsContainer
} from './Feature.styled'

import {
  CardPlusIcon,
  NotePlusIcon,
  NoteMinusIcon,
  TextboxPlusIcon,
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
    Icon: TextboxPlusIcon,
  },
  {
    text: `Add Scenario`,
    onClick: addScenario,
    Icon: PlaylistPlusIcon,
  },
]

const useMenuItems = () => {
  const { settings, toggleGeneral } = useSettings()
  return useMemo(() => {
    return [
      {
        onClick: () => toggleGeneral(),
        Icon: settings.displayGeneral ? NoteMinusIcon : NotePlusIcon,
        text: settings.displayGeneral ? `Hide General` : `Show General`
      },
      ...menuItems
    ]
    
  }, [settings.displayGeneral])
}

export const FeatureActions = (props:TFeatureActions) => {
  const { feature } = useEditor()
  const items = useMenuItems()

  return (
    <FeatureActionsContainer>
      <HeaderText>
        Feature
      </HeaderText>
      <FeatureMenu items={items} />
    </FeatureActionsContainer>
  )

}