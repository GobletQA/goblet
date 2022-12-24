import {
  useDefs,
  useRepo,
  useFeatures,
} from '@store'

import { useRaceSteps } from './useRaceSteps'
import { useRaceModels } from './useRaceModels'

export const useRaceHooks = () => {
  const repo = useRepo()
  const defs = useDefs()
  const features = useFeatures()

  const models = useRaceModels(features)
  const steps = useRaceSteps(defs)

  return {
    steps,
    models,
    connected: Boolean(repo?.paths && repo?.name)
  }
}