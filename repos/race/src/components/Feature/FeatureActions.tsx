import { useMemo } from 'react'
import { FeatureMenu } from './FeatureMenu'
import { useSettings, useEditor } from '@GBR/contexts'
import {
  HeaderText,
  FeatureActionsContainer
} from './Feature.styled'
import { FeatureItems } from './FeatureItems'

import {
  NotePlusIcon,
  NoteMinusIcon,
} from '@gobletqa/components'

export type TFeatureActions = {}

const styles = {
  actions: {
    opacity: 1,
  }
}

const useMenuItems = () => {
  const { settings, toggleGeneral } = useSettings()
  return useMemo(() => {
    return [
      {
        onClick: () => toggleGeneral(),
        Icon: settings.displayGeneral ? NoteMinusIcon : NotePlusIcon,
        text: settings.displayGeneral ? `Hide General` : `Show General`
      },
      ...FeatureItems
    ]
    
  }, [settings.displayGeneral])
}

export const FeatureActions = (props:TFeatureActions) => {
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