import type { TRaceRule } from '@GBR/types'

import { EGherkinKeys } from '@GBR/types'
import { scenariosFactory } from './scenarioFactory'
import { backgroundFactory } from './backgroundFactory'
import { toObj } from '@gobletqa/race/utils/helpers/toObj'
import { deepMerge, uuid, emptyArr } from '@keg-hub/jsutils'

export type TRuleFactory = {
  rule?:Partial<TRaceRule>
  empty?:boolean
}

export type TRulesFactory = {
  rules?:Partial<TRaceRule>[],
  empty?:boolean
}

const emptyRule = ():TRaceRule => ({
  tags: [],
  rule: ` `,
  uuid: uuid(),
  scenarios: [],
  whitespace: `  `,
})

export const ruleFactory = ({
  rule,
  empty=false
}:TRuleFactory) => {
  return rule
    ? deepMerge<TRaceRule>(
        emptyRule(),
        rule,
        {
          scenarios: scenariosFactory({ scenarios: rule?.scenarios }),
          ...toObj(`background`, backgroundFactory({ background: rule?.background })),
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
  ? rules.map(rule => rule && ruleFactory({rule, empty})).filter(Boolean) as TRaceRule[]
  : emptyArr

}