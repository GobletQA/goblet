import type { TEmptyFeature, TRaceFeature } from '@GBR/types'

import { ESectionType } from '@GBR/types'
import { rulesFactory } from './ruleFactory'
import { scenariosFactory } from './scenarioFactory'
import { deepMerge, ensureArr } from '@keg-hub/jsutils'
import { backgroundFactory } from './backgroundFactory'
import { toObj } from '@gobletqa/race/utils/helpers/toObj'
import { blockFactory, blocksFactory } from './blockFactory'
import { FeatureIndexMap, EmptyFeatureUUID } from '@GBR/constants/values'

export const featureFactory = async (feat:TEmptyFeature|TRaceFeature, empty?:boolean) => {
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

  const newBackground = await backgroundFactory({
    background,
    feature: feat
  })
  const newRules = await rulesFactory({ rules, feature: feat })
  const newReason = await blocksFactory({ blocks: reasons, feature: feat })
  const newComments = await blocksFactory({ blocks: comments, feature: feat })
  const newEmpty = await blocksFactory({ blocks: feat.empty, feature: feat })
  const newDesire = await blockFactory({
    block: desire,
    feature: feat,
    index: FeatureIndexMap.desire,
  })
  const newPerspective = await blockFactory({
    feature: feat,
    block: perspective,
    index: FeatureIndexMap.perspective
  })
  const newScenarios = await scenariosFactory({
    scenarios,
    feature: feat
  })

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
      ...toObj(`rules`, newRules),
      ...toObj(`reason`, newReason),
      ...toObj(`comments`, newComments),
      ...toObj(`empty`, newEmpty),
      ...toObj(`desire`, newDesire),
      ...toObj(`scenarios`, newScenarios),
      ...toObj(`background`, newBackground),
      ...toObj(`perspective`, newPerspective),
    }
  )
}


