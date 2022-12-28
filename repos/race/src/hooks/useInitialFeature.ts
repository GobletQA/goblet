import type { TRaceEditorProps } from '../types'

import { useMemo } from 'react'

export const useInitialFeature = ({
  feature,
  features,
  firstFeatureActive
}:TRaceEditorProps) => {
  return useMemo(() => feature || firstFeatureActive ? Object.values(features)?.[0] : undefined, [])
}