import type { MouseEvent } from 'react'
import type { TRaceScenario } from '@GBR/types'
import type { TFeatureItem } from '@GBR/components/Feature/FeatureItems'

import { useMemo } from 'react'
import { EEditorMode } from '@GBR/types'
import { useEditor, useSettings } from '@GBR/contexts'
import { settingChange } from '@GBR/actions/settings/settingChange'
import {
  RuleItem,
  ModeItem,
  StepItem,
  AuditItem,
  GeneralItem,
  ScenarioItem,
  BackgroundItem,
  ModeItemActive,
  GeneralItemActive,
} from '@GBR/components/Feature/FeatureItems'

export type THFeatureItems = {
  scenario?:TRaceScenario
  onSimpleAdd?:() => void
}

export const useFeatureItems = (props:THFeatureItems) => {

  const { onSimpleAdd } = props
  const { settings, toggleMeta } = useSettings()
  const { feature, onAuditFeature } = useEditor()
  const advMode = settings.mode === EEditorMode.advanced

  return useMemo<TFeatureItem[]>(() => {

    const auditItem = {
      ...AuditItem,
      dividerTop: true,
      onClick: () => onAuditFeature(feature, {})
    }

    const modeItem = {
      ...(advMode ? ModeItemActive : ModeItem),
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
      : [{
          ...StepItem,
          onClick:(evt:MouseEvent<HTMLElement>) => onSimpleAdd?.()
        }]

    return [
      ...addItems,
      auditItem,
      modeItem,
    ].filter(Boolean)
  }, [
    advMode,
    feature,
    onSimpleAdd,
    onAuditFeature,
    settings?.displayMeta,
  ])
}