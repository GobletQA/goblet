import type { TRaceFeature } from '@GBR/types'


import { useMemo } from 'react'
import { EEditorMode } from '@GBR/types'
import { useSettings } from '@GBR/contexts'
import { ensureScenario } from '@GBR/utils/features/ensureScenario'

export type THEnsureScenario = {
  parent:TRaceFeature
}

export const useEnsureScenario = ({ parent }:THEnsureScenario) => {
  const { settings } = useSettings()
  
  return useMemo(() => {
    return settings.mode !== EEditorMode.advanced
      ? ensureScenario(parent)
      : undefined
  }, [
    settings.mode,
    parent?.scenarios,
  ])
}
