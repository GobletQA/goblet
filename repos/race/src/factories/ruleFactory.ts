import type { TRuleAst } from '@GBR/types'

import { toObj } from '@gobletqa/race/utils/helpers/toObj'
import { scenariosFactory } from './scenarioFactory'
import { backgroundFactory } from './backgroundFactory'
import { deepMerge, uuid, emptyArr } from '@keg-hub/jsutils'

const emptyRule = ():TRuleAst => ({
  index: 0,
  rule: ``,
  tags: [],
  uuid: uuid(),
  scenarios: []
})

export const ruleFactory = (
  rule?:Partial<TRuleAst>,
  empty:boolean=false
) => {
  return rule
    ? deepMerge<TRuleAst>(
        emptyRule(),
        rule,
        {
          scenarios: scenariosFactory(rule?.scenarios),
          ...toObj(`background`, backgroundFactory(rule?.background)),
        }
      )
    : empty
      ? emptyRule()
      : undefined
}

export const rulesFactory = (
  rules?:Partial<TRuleAst>[],
  empty:boolean=false
) => {
  return rules?.length
  ? rules.map(rule => rule && ruleFactory(rule, empty)).filter(Boolean) as TRuleAst[]
  : emptyArr

}