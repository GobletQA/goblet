import type { TEmptyFeature, TRaceFeature } from '@GBR/types'

import { toObj } from '@GBR/utils/toObj'
import { titleFromPath } from '@GBR/utils/titleFromPath'

import { deepMerge, uuid } from '@keg-hub/jsutils'

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

  const fUuid = feat?.uuid || uuid()

  return deepMerge<TRaceFeature>(
    {
      uuid: fUuid,
      tags: [],
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
      ...toObj(`title`, feat.title || titleFromPath(path)),
      ...toObj(`empty`, empty)
    }
  )
}


