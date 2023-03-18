import type { TRaceFeature, TRaceRule } from '@GBR/types'

import { ESectionType } from '@GBR/types'
import { scenariosFactory } from './scenarioFactory'
import { backgroundFactory } from './backgroundFactory'
import { toObj } from '@gobletqa/race/utils/helpers/toObj'
import { deepMerge, uuid, emptyArr } from '@keg-hub/jsutils'

export type TRuleFactory = {
  rule?:Partial<TRaceRule>
  empty?:boolean
  feature: TRaceFeature
}

export type TRulesFactory = {
  rules?:Partial<TRaceRule>[],
  empty?:boolean
  feature: TRaceFeature
}

const emptyRule = () => ({
  rule: ` `,
  uuid: uuid(),
  scenarios: [],
  whitespace: `  `,
  type: ESectionType.rule,
} as Partial<TRaceRule>)

export const ruleFactory = ({
  rule,
  feature,
  empty=false,
}:TRuleFactory) => {
  return rule
    ? deepMerge<TRaceRule>(
        emptyRule(),
        rule,
        {
          scenarios: scenariosFactory({
            feature,
            scenarios: rule?.scenarios,
          }),
          ...toObj(`background`, backgroundFactory({
            feature,
            background: rule?.background,
          })),
        }
      )
    : empty
      ? emptyRule() as TRaceRule
      : undefined
}

export const rulesFactory = ({
  rules,
  feature,
  empty=false
}:TRulesFactory) => {
  return rules?.length
  ? rules.map(rule => rule && ruleFactory({rule, empty, feature})).filter(Boolean) as TRaceRule[]
  : emptyArr

}