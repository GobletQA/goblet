import type { TRaceScenario, TRaceFeature, TRaceRule } from '@GBR/types'

import { EAstObject } from '@ltipton/parkin'
import { scenariosFactory } from './scenarioFactory'
import { backgroundFactory } from './backgroundFactory'
import { deepMerge, emptyArr } from '@keg-hub/jsutils'
import { ParkinWorker } from '@GBR/workers/parkin/parkinWorker'

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
  scenarios: [],
  type: EAstObject.rule,
  ...rule
} as Partial<TRaceRule>)

export const ruleFactory = async ({
  rule,
  feature,
  empty=false,
}:TRuleFactory) => {

  const index = await ParkinWorker.findIndex({
    feature,
    parent: feature,
    type:EAstObject.rules,
  })

  const whitespace = feature?.whitespace?.length ? `${feature.whitespace}  ` : `  `
  const uuid = `${feature.uuid}.${EAstObject.rule}.${index}`

  const built = rule
    ? deepMerge<TRaceRule>(
        emptyRule({ uuid, index, whitespace }),
        rule,
      )
    : empty
      ? emptyRule({ uuid, index, whitespace }) as TRaceRule
      : undefined

  if(!built) return console.warn(`Error building rule in factory`)

  built.scenarios = (await scenariosFactory({
    feature,
    parent: built,
    scenarios: rule?.scenarios,
  }) || []) as TRaceScenario[]
  
  rule?.background && (
    rule.background = await backgroundFactory({
      feature,
      parent: rule as TRaceRule,
      background: rule?.background,
    })
  )

  return built
}

export const rulesFactory = async ({
  rules,
  feature,
  empty=false
}:TRulesFactory) => {
  if(!rules?.length) return emptyArr

  const built = await Promise.all(rules.map(async (rule) => rule && await ruleFactory({rule, empty, feature})))

  return built.filter(Boolean) as TRaceRule[]
}