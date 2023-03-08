import { useMemo } from 'react'
import { ESectionType } from '@GBR/types'
import { FeatureMenu } from './FeatureMenu'
import { useSettings } from '@GBR/contexts'
import {
  HeaderText,
  FeatureHeaderContainer,
  FeatureActionsContainer,
} from './Feature.styled'
import { FeatureItems } from './FeatureItems'
import { FeatureAction } from './FeatureAction'
import { FeatureHeaderActions } from './FeatureHeaderActions'

import {
  NotePlusIcon,
  NoteMinusIcon,
} from '@gobletqa/components'

export type TFeatureHeader = {}

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
        text: settings.displayGeneral ? `Hide General` : `Show General`,
        type: ESectionType.story,
        featureKey: ESectionType.story,
        description: ``,
      },
      ...FeatureItems
    ]
    
  }, [settings.displayGeneral])
}

export const FeatureHeader = (props:TFeatureHeader) => {
  const items = useMenuItems()

  return (
    <FeatureHeaderContainer className='feature-header-container' >

      <HeaderText>
        Feature
      </HeaderText>

      <FeatureHeaderActions items={items}/>

      <FeatureMenu items={items} />
    </FeatureHeaderContainer>
  )

}