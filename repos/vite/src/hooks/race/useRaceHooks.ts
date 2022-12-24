import {
  useDefs,
  useRepo,
  useFeatures,
} from '@store'

import { useRaceSteps } from './useRaceSteps'
import { useRaceFeatures } from './useRaceFeatures'

export const useRaceHooks = () => {
  const repo = useRepo()
  const defs = useDefs()
  const steps = useRaceSteps(defs)

  const localFeatures = useFeatures()
  const features = useRaceFeatures(localFeatures)

  return {
    steps,
    features,
    connected: Boolean(repo?.paths && repo?.name)
  }
}