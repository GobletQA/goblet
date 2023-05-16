import type { MouseEvent } from 'react'
import type { TFeatureItem } from '@GBR/components/Feature/FeatureItems'

import { useMemo } from 'react'
import { EEditorMode } from '@GBR/types'
import { useEditor, useSettings } from '@GBR/contexts'
import { settingChange } from '@GBR/actions/settings/settingChange'
import {
  RuleItem,
  ModeItem,
  WorldItem,
  GeneralItem,
  ScenarioItem,
  BackgroundItem,
  ModeItemActive,
  GeneralItemActive,
} from '@GBR/components/Feature/FeatureItems'

export const useFeatureItems = () => {

  const { settings, toggleMeta } = useSettings()
  const { feature,  } = useEditor()
  const advMode = settings.mode === EEditorMode.advanced

  return useMemo<TFeatureItem[]>(() => {

    const modeItem = {
      ...(advMode ? ModeItemActive : ModeItem),
      dividerTop: true,
      onClick: () => settingChange({
        setting: `mode`,
        value: advMode ? EEditorMode.simple : EEditorMode.advanced
      })
    }
    
    const generalItem = {
      ...(settings?.displayMeta ? GeneralItemActive : GeneralItem),
      dividerTop: true,
      // Doesn't call the external settings change callback
      onClick: () => toggleMeta(),
    }

    const addItems = advMode
      ? [
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
          generalItem,
        ]
      : []

    return [
      ...addItems,
      WorldItem,
      modeItem,
    ].filter(Boolean)
  }, [
    advMode,
    feature,
    settings?.displayMeta,
  ])
}