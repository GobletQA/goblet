import type { MouseEvent } from 'react'
import type { TRaceFeature } from '@GBR/types'
import type { TFeatureItem } from '@GBR/components/Feature/FeatureItems'

import { useMemo } from 'react'
import { useSettings } from '@GBR/contexts'
import {
  NotePlusIcon,
  NoteMinusIcon,
} from '@gobletqa/components'
import {
  RuleItem,
  GeneralItem,
  ScenarioItem,
  BackgroundItem,
} from '@GBR/components/Feature/FeatureItems'

export type THFeatureItems = {
  feature:TRaceFeature
}

export const useFeatureItems = (props:THFeatureItems) => {
  const { feature } = props
  
  const { settings, toggleMeta } = useSettings()
  return useMemo<TFeatureItem[]>(() => {

    return [
      {
        ...ScenarioItem,
        onClick:(evt:MouseEvent<HTMLElement>) => ScenarioItem.onClick?.(
          evt,
          feature.uuid,
          feature.type
        )
      },
      RuleItem,
      {
        ...BackgroundItem,
        text: feature?.background?.uuid ? `Remove Background` : BackgroundItem.text,
        onClick:(evt:MouseEvent<HTMLElement>) => BackgroundItem.onClick?.(
          evt,
          feature.uuid,
          feature.type
        )
      },
      {
        ...GeneralItem,
        dividerTop: true,
        onClick: () => toggleMeta(),
        Icon: settings?.displayMeta ? NoteMinusIcon : NotePlusIcon,
        text: settings?.displayMeta ? `Hide General` : `Show General`,
      },
    ]
  }, [feature, settings?.displayMeta])
}