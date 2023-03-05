import type { TRuleAst } from '@ltipton/parkin'

import { ESectionType } from '@GBR/types'
import { scenariosFactory } from './scenarioFactory'
import { backgroundFactory } from './backgroundFactory'
import { toObj } from '@gobletqa/race/utils/helpers/toObj'
import { deepMerge, uuid, emptyArr } from '@keg-hub/jsutils'

export type TRuleFactory = {
  rule?:Partial<TRuleAst>
  empty?:boolean
}

export type TRulesFactory = {
  rules?:Partial<TRuleAst>[],
  empty?:boolean
}

const emptyRule = ():TRuleAst => ({
  index: 0,
  rule: ``,
  tags: [],
  uuid: uuid(),
  scenarios: [],
  whitespace: ``
})

export const ruleFactory = ({
  rule,
  empty=false
}:TRuleFactory) => {
  return rule
    ? deepMerge<TRuleAst>(
        emptyRule(),
        rule,
        {
          scenarios: scenariosFactory({
            parent: ESectionType.rule,
            scenarios: rule?.scenarios,
          }),
          ...toObj(`background`, backgroundFactory({
              parent: ESectionType.rule,
              background: rule?.background,
            })),
        }
      )
    : empty
      ? emptyRule()
      : undefined
}

export const rulesFactory = ({
  rules,
  empty=false
}:TRulesFactory) => {
  return rules?.length
  ? rules.map(rule => rule && ruleFactory({rule, empty})).filter(Boolean) as TRuleAst[]
  : emptyArr

}