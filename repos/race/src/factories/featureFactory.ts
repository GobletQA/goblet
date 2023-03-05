import type { TEmptyFeature, TRaceFeature } from '@GBR/types'

import { deepMerge, ensureArr } from '@keg-hub/jsutils'
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
  const reasons = reason
    ? ensureArr(reason).map((rea, idx) => rea.index = rea.index || FeatureIndexMap.reason + idx)
    : reason

  return deepMerge<TRaceFeature>(
    {
      tags: [],
      uuid: fUuid,
      feature: ``,
      content: ``,
      isEmpty: true,
    },
    feat,
    {
      parent: {
        uuid: fUuid,
        location: path
      },
      path: feat.path,
      ...toObj(`rules`, rulesFactory({ rules })),
      ...toObj(`scenarios`, scenariosFactory({scenarios})),
      ...toObj(`reason`, blocksFactory({ blocks: reasons })),
      ...toObj(`comments`, blocksFactory({ blocks: comments})),
      ...toObj(`empty`, blocksFactory({ blocks: feat.empty })),
      ...toObj(`background`, backgroundFactory({ background })),
      ...toObj(`desire`, blockFactory({ block: desire, index: FeatureIndexMap.desire })),
      ...toObj(`perspective`, blockFactory({ block: perspective, index: FeatureIndexMap.perspective })),
    }
  )
}


