import {
  useDefs,
  useRepo,
  useFeatures,
} from '@store'
import { useMemo } from 'react'
import { useRaceSteps } from './useRaceSteps'
import { useRaceFeatures } from './useRaceFeatures'
import { getFeaturePrefix } from '@utils/features/getFeaturePrefix'

export const useRaceHooks = () => {
  const repo = useRepo()
  const defs = useDefs()
  const steps = useRaceSteps(defs)

  const localFeatures = useFeatures()
  const features = useRaceFeatures(localFeatures)
  const rootPrefix = useMemo(() => getFeaturePrefix(repo), [repo?.paths])

  return {
    steps,
    features,
    rootPrefix,
    connected: Boolean(repo?.paths && repo?.name)
  }
}