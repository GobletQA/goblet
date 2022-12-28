import type { TRaceEditorProps } from '../types'

import { useRef, useMemo } from 'react'
import { noOp } from '@keg-hub/jsutils'


export const useInitialFeature = ({
  feature,
  features,
  firstFeatureActive
}:TRaceEditorProps) => {
  return useMemo(() => feature || firstFeatureActive ? Object.values(features)?.[0] : undefined, [])
}