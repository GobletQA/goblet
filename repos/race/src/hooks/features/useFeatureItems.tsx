import type { TFeatureItem } from '@GBR/components/Feature/FeatureItems'

import { useMemo } from 'react'
import { ESectionType } from '@GBR/types'
import { useSettings } from '@GBR/contexts'
import { FeatureItems, GeneralItem } from '@GBR/components/Feature/FeatureItems'
import {
  NotePlusIcon,
  NoteMinusIcon,
} from '@gobletqa/components'

export const useFeatureItems = () => {
  const { settings, toggleMeta } = useSettings()
  return useMemo(() => {
    return [
      {
        ...GeneralItem,
        onClick: () => toggleMeta(),
        Icon: settings.displayMeta ? NoteMinusIcon : NotePlusIcon,
        text: settings.displayMeta ? `Hide General` : `Show General`,
      },
      ...FeatureItems.filter(item => item.type !== ESectionType.general)
    ] as TFeatureItem[]
    
  }, [settings.displayMeta])
}