import type { TRaceScenario, TRaceFeature, TRaceRule } from '@GBR/types'

import { EAstObject } from '@ltipton/parkin'
import { scenariosFactory } from './scenarioFactory'
import { findIndex } from '@GBR/utils/find/findIndex'
import { backgroundFactory } from './backgroundFactory'
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

const emptyRule = (rule:Partial<TRaceRule>) => ({
  rule: ` `,
  uuid: uuid(),
  scenarios: [],
  type: EAstObject.rule,
} as Partial<TRaceRule>)

export const ruleFactory = ({
  rule,
  feature,
  empty=false,
}:TRuleFactory) => {

  const index = findIndex({
    feature,
    parent: feature,
    type:EAstObject.rules,
  })

  const whitespace = feature?.whitespace?.length ? `${feature.whitespace}  ` : `  `

  const built = rule
    ? deepMerge<TRaceRule>(
        emptyRule({ index, whitespace }),
        rule,
      )
    : empty
      ? emptyRule({ index, whitespace }) as TRaceRule
      : undefined

  if(!built) return console.warn(`Error building rule in factory`)

  built.scenarios = (scenariosFactory({
    feature,
    parent: built,
    scenarios: rule?.scenarios,
  }) || []) as TRaceScenario[]
  
  rule?.background && (
    rule.background = backgroundFactory({
      feature,
      parent: rule as TRaceRule,
      background: rule?.background,
    })
  )

  return built
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