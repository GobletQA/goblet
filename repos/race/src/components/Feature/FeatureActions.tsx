import { useMemo } from 'react'
import { FeatureMenu } from './FeatureMenu'
import { useSettings } from '@GBR/contexts'
import {
  HeaderText,
  FeatureActionsContainer,
  FeatureSubActionsContainer,
} from './Feature.styled'
import { FeatureItems } from './FeatureItems'
import { FeatureAction } from './FeatureAction'

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
    <FeatureActionsContainer className='feature-actions-container' >
      <HeaderText>
        Feature
      </HeaderText>
      
      <FeatureSubActionsContainer className='feature-sub-actions-container' >
        {FeatureItems.map(item => {
          return (
            <FeatureAction {...item} />
          )
        })}
      </FeatureSubActionsContainer>
      
      <FeatureMenu items={items} />
    </FeatureActionsContainer>
  )

}