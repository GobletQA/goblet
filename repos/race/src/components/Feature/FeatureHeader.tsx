import { useMemo } from 'react'
import { ESectionType } from '@GBR/types'
import { FeatureMenu } from './FeatureMenu'
import { useSettings } from '@GBR/contexts'
import {
  HeaderText,
  FeatureHeaderContainer,
} from './Feature.styled'
import { FeatureItems } from './FeatureItems'
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
  const { settings, toggleMeta } = useSettings()
  return useMemo(() => {
    return [
      {
        key: ESectionType.story,
        type: ESectionType.story,
        featureKey: ESectionType.story,
        onClick: () => toggleMeta(),
        Icon: settings.displayMeta ? NoteMinusIcon : NotePlusIcon,
        text: settings.displayMeta ? `Hide Meta` : `Show Meta`,
        description: ``,
      },
      ...FeatureItems
    ]
    
  }, [settings.displayMeta])
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