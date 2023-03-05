import type { TRuleAst } from '@ltipton/parkin'

import { ESectionType } from '@GBR/types'
import { scenariosFactory } from './scenarioFactory'
import { backgroundFactory } from './backgroundFactory'
import { toObj } from '@gobletqa/race/utils/helpers/toObj'
import { deepMerge, uuid, emptyArr } from '@keg-hub/jsutils'

const emptyRule = ():TRuleAst => ({
  index: 0,
  rule: ``,
  tags: [],
  uuid: uuid(),
  scenarios: [],
  whitespace: ``
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
          ...toObj(`background`, backgroundFactory(rule?.background, undefined, ESectionType.rule)),
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