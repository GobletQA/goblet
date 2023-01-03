import type { TEmptyFeature, TRaceFeature } from '@GBR/types'

import { deepMerge } from '@keg-hub/jsutils'
import { toObj } from '@gobletqa/race/utils/toObj'
import { EmptyFeatureUUID } from '@GBR/constants/values'

import { rulesFactory } from './ruleFactory'
import { scenariosFactory } from './scenarioFactory'
import { backgroundFactory } from './backgroundFactory'
import { blockFactory, blocksFactory } from './blockFactory'

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
      ...toObj(`rules`, rulesFactory(rules)),
      ...toObj(`reason`, blockFactory(reason)),
      ...toObj(`desire`, blockFactory(desire)),
      ...toObj(`comments`, blocksFactory(comments)),
      ...toObj(`scenarios`, scenariosFactory(scenarios)),
      ...toObj(`perspective`, blockFactory(perspective)),
      ...toObj(`background`, backgroundFactory(background)),
      ...toObj(`empty`, empty)
    }
  )
}


