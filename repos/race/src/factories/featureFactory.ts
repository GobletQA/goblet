import type { TEmptyFeature, TRaceFeature } from '@GBR/types'

import { ESectionType } from '@GBR/types'
import { rulesFactory } from './ruleFactory'
import { scenariosFactory } from './scenarioFactory'
import { deepMerge, ensureArr } from '@keg-hub/jsutils'
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
      index: 0,
      uuid: fUuid,
      feature: ``,
      content: ``,
      isEmpty: true,
      type: ESectionType.feature,
    },
    feat,
    {
      parent: {
        uuid: fUuid,
        location: path
      },
      path: feat.path,
      ...toObj(`rules`, rulesFactory({ rules, feature: feat })),
      ...toObj(`reason`, blocksFactory({ blocks: reasons, feature: feat })),
      ...toObj(`comments`, blocksFactory({ blocks: comments, feature: feat })),
      ...toObj(`empty`, blocksFactory({ blocks: feat.empty, feature: feat })),
      ...toObj(`desire`, blockFactory({
        block: desire,
        feature: feat,
        index: FeatureIndexMap.desire,
      })),
      ...toObj(`scenarios`, scenariosFactory({
        scenarios,
        feature: feat
      })),
      ...toObj(`background`, backgroundFactory({
        background,
        feature: feat
      })),
      ...toObj(`perspective`, blockFactory({
        feature: feat,
        block: perspective,
        index: FeatureIndexMap.perspective
      })),
    }
  )
}


