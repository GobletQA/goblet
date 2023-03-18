import type {
  TBlockType,
  TRaceRule,
  TRaceStep,
  TRaceBlock,
  TRaceIndex,
  TRaceFeature,
  TRaceScenario,
  TRaceBackground,
  TRaceStepParent,
  TRaceBlockParent,
  TRaceScenarioParent,
  TRaceBackgroundParent,
} from '@GBR/types'

import { ESectionType } from '@GBR/types'
import { isArr } from '@keg-hub/jsutils'

const indexSteps = (
  indexes:TRaceIndex,
  steps:TRaceStep[],
  parent:TRaceStepParent
) => {
  steps.forEach(step => {
    indexes[step.index] = {ast: step, parent}
  })
} 

const indexScenario = (
  indexes:TRaceIndex,
  scenarios:TRaceScenario[],
  parent:TRaceScenarioParent
) => {
  scenarios.forEach(scenario => {
    indexes[scenario.index] = {ast: scenario, parent}
    scenario.steps && indexSteps(indexes, scenario.steps, scenario)
  })
}

const indexRules = (
  indexes:TRaceIndex,
  rules:TRaceRule[],
  parent:TRaceFeature
) => {
  rules.forEach(rule => {
    indexes[rule.index] = {ast: rule, parent}
    rule.scenarios && indexScenario(indexes, rule.scenarios, rule)
  })
}

const indexReason = (
  indexes:TRaceIndex,
  reason:TRaceBlock|TRaceBlock[],
  parent:TRaceFeature
) => {
  isArr<TRaceBlock[]>(reason)
    ? reason.forEach(reason => {
        indexes[reason.index] = {ast: reason, parent}
      })
    : (() => {
        indexes[reason.index] = {ast: reason, parent}
      })()
}

const indexBackground = (
  indexes:TRaceIndex,
  background:TRaceBackground,
  parent:TRaceBackgroundParent
) => {
  indexes[background.index] = {ast: background, parent}
  background?.steps && indexSteps(indexes, background.steps, background)
}

const indexBlocks = (
  indexes:TRaceIndex,
  blocks:TRaceBlock[],
  type:TBlockType,
  parent:TRaceBlockParent
) => {
  blocks.forEach(block => {
    if(block.type !== type) block.type = type

    indexes[block.index] = {ast: block, parent}
  })
}

export const featureToIndexes = (feature:TRaceFeature) => {
  const indexes = [] as unknown as TRaceIndex

  feature.tags?.tokens.length
    && indexes.push({
        parent: feature,
        ast: feature.tags,
      })

  indexes[feature.index || indexes.length] = {ast: feature, parent: feature}

  feature?.empty
    && indexBlocks(
      indexes,
      feature?.empty,
      ESectionType.empty,
      feature
    )

  feature?.comments
    && indexBlocks(
        indexes,
        feature?.comments,
        ESectionType.comment,
        feature
      )

  feature.desire
    && indexBlocks(
        indexes,
        [feature.desire],
         ESectionType.desire,
         feature
      )
  feature.perspective
    && indexBlocks(
        indexes,
        [feature.perspective],
         ESectionType.perspective,
         feature
      )

  feature.reason
    && indexReason(
        indexes,
        feature.reason,
        feature
      )

  feature.background
    && indexBackground(
        indexes,
        feature.background,
        feature
      )
  feature.rules
    && indexRules(
        indexes,
        feature.rules,
        feature
      )
  feature.scenarios
    && indexScenario(
        indexes,
        feature.scenarios,
        feature
      )

  return indexes
}
