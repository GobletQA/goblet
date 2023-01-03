import type { TRuleAst } from '@GBR/types'

import { toObj } from '@gobletqa/race/utils/toObj'
import { scenariosFactory } from './scenarioFactory'
import { backgroundFactory } from './backgroundFactory'
import { deepMerge, uuid, emptyArr } from '@keg-hub/jsutils'

export const ruleFactory = (rule?:Partial<TRuleAst>) => {
  return rule
    ? deepMerge<TRuleAst>(
        {
          rule: ``,
          tags: [],
          uuid: uuid(),
        },
        rule,
        {
          scenarios: scenariosFactory(rule?.scenarios),
          ...toObj(`background`, backgroundFactory(rule?.background)),
        }
      )
    : undefined
}

export const rulesFactory = (rules?:Partial<TRuleAst>[]) => {
  return rules?.length
  ? rules.map(rule => rule && ruleFactory(rule)).filter(Boolean) as TRuleAst[]
  : emptyArr

}