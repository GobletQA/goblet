import type { TEmptyFeature, TRaceFeature } from '@GBR/types'

import { deepMerge } from '@keg-hub/jsutils'
import { rulesFactory } from './ruleFactory'
import { scenariosFactory } from './scenarioFactory'
import { backgroundFactory } from './backgroundFactory'
import { toObj } from '@gobletqa/race/utils/helpers/toObj'
import { blockFactory, blocksFactory } from './blockFactory'
import { FeatureIndexMap, EmptyFeatureUUID } from '@GBR/constants/values'

export const featureFactory = (feat:TEmptyFeature, empty?:boolean) => {
  const {
    path,
    rules,
    reason,
    desire,
    comments,
    scenarios,
    background,
    perspective,
  } = feat

  const fUuid = feat?.uuid || EmptyFeatureUUID

  return deepMerge<TRaceFeature>(
    {
      tags: [],
      uuid: fUuid,
      feature: ``,
      content: ``,
    },
    feat,
    {
      parent: {
        uuid: fUuid,
        location: path
      },
      path: feat.path,
      ...toObj(`empty`, empty),
      ...toObj(`rules`, rulesFactory(rules)),
      ...toObj(`comments`, blocksFactory(comments)),
      ...toObj(`scenarios`, scenariosFactory(scenarios)),
      ...toObj(`background`, backgroundFactory(background)),
      ...toObj(`reason`, blockFactory(reason, FeatureIndexMap.reason)),
      ...toObj(`desire`, blockFactory(desire, FeatureIndexMap.desire)),
      ...toObj(`perspective`, blockFactory(perspective, FeatureIndexMap.perspective)),
    }
  )
}


