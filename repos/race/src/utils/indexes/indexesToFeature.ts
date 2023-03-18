import type {
  TRaceAst,
  TRaceTags,
  TRaceStep,
  TRaceRule,
  TRaceIndex,
  TRaceBlock,
  TRaceFeature,
  TRaceScenario,
  TRaceParentAst,
  TRaceTagsParent,
  TRaceBackground,
  TRaceStepParent,
  TRaceScenarioParent,
  TRaceBackgroundParent,
} from '@GBR/types'

import { ESectionType } from '@GBR/types'
import { deepEqual, eitherArr } from '@keg-hub/jsutils'

type TWithUuid = {
  uuid: string
  index: number
  content?:string
}


const mergeItem = <T extends TWithUuid, P>(
  parent:Partial<P>,
  key:keyof typeof parent,
  ast:T
) => {
  const existing = parent[key] as T

  ;(parent[key] as T) = !existing
    ? ast
    : existing?.uuid === ast?.uuid
      ? {...existing as T, ...ast}
      : ast

  return parent[key] as T
}

const astArray = <T extends TWithUuid, P>(
  parent:Partial<P>,
  key:keyof typeof parent,
  ast:T
) => {
  ;(parent[key] as T[]) = eitherArr<T[]>(parent[key], [])

  const typeArr = parent[key] as T[]
  const found = typeArr.find(item => item?.uuid === ast?.uuid)

  if(!found) return (parent[key] as T[]) = [...typeArr, ast]
  else if(key === ESectionType.empty && found.index === ast.index) return
  else if(key === ESectionType.comments && found?.content === ast?.content) return
  else {
    const idx = typeArr.indexOf(found)
    const updated = [...typeArr]
    updated[idx] = { ...found, ...ast}

    ;(parent[key] as T[]) = updated
  }

}

const mergeParent = <T extends TWithUuid, P=TRaceFeature>(
  oldFeat:P,
  newFeat:P,
  parent:T,
  key:keyof typeof oldFeat,
) => {
  ;(newFeat[key] as T[]) = eitherArr<T[]>(newFeat[key], [])

  const existing = (newFeat[key] as T[])?.find(item => item.uuid === parent.uuid)
  if(existing) return parent
  
  const found = (oldFeat[key] as T[])?.find(item => item.uuid === parent.uuid)
  const merged = !found ? parent : {...found, ...parent}

  ;(newFeat[key] as T[]).push(merged)
  
  return merged
}

const findParent = <T>(
  oldFeat:TRaceFeature,
  newFeat:TRaceFeature,
  parent:TRaceParentAst
) => {
  
  switch(parent.type){
      case ESectionType.feature: {
        return newFeat as T
      }
      case ESectionType.background: {
        const background = mergeItem<TRaceBackground, TRaceFeature>(
          { background: oldFeat.background },
          ESectionType.background,
          parent,
        )
        if(background) newFeat.background = background

        return background as T
      }
      case ESectionType.rule: {
        return mergeParent<TRaceRule>(
          oldFeat,
          newFeat,
          parent,
          ESectionType.rules
        ) as T
      }
      case ESectionType.scenario: {
        return mergeParent<TRaceScenario>(
          oldFeat,
          newFeat,
          parent,
          ESectionType.scenarios
        ) as T
      }
  }
  
}


/**
 * Builds a TRaceFeature from the passed in TRaceIndex
 * Uses the current feature to fill missing feature values
 * Can be treated as a merge of a feature and updates to it
 * The indexes should be of the same feature
 */
export const indexesToFeature = (
  indexes:TRaceIndex,
  feature:TRaceFeature,
) => {

  return indexes.reduce((feat, item, idx) => {
    const { ast } = item
    if(ast === feature) return feat

    switch(ast.type){
      case ESectionType.desire: {
        const parent = findParent<TRaceFeature>(
          feature,
          feat,
          item.parent
        )
        mergeItem<TRaceBlock, TRaceFeature>(
          parent,
          ESectionType.desire,
          ast
        )
        break
      }
      case ESectionType.perspective: {
        const parent = findParent<TRaceFeature>(
          feature,
          feat,
          item.parent
        )
        mergeItem<TRaceBlock, TRaceFeature>(
          parent,
          ESectionType.perspective,
          ast
        )
        break
      }
      case ESectionType.tags: {
        const parent = findParent<TRaceTagsParent>(
          feature,
          feat,
          item.parent
        )
        mergeItem<TRaceTags, TRaceTagsParent>(
          parent,
          ESectionType.tags,
          ast
        )
        break
      }
      case ESectionType.background: {
        const parent = findParent<TRaceBackgroundParent>(
          feature,
          feat,
          item.parent
        )
        mergeItem<TRaceBackground, TRaceBackgroundParent>(
          parent,
          ESectionType.background,
          ast
        )
        break
      }
      case ESectionType.step: {
        const parent = findParent<TRaceStepParent>(
          feature,
          feat,
          item.parent
        )
        astArray<TRaceStep, TRaceStepParent>(
          parent,
          ESectionType.steps,
          ast
        )
        break
      }
      case ESectionType.reason: {
        const parent = findParent<TRaceFeature>(
          feature,
          feat,
          item.parent
        )
        astArray<TRaceBlock, TRaceFeature>(
          parent,
          ESectionType.reason,
          ast
        )
        break
      }
      case ESectionType.empty: {
        const parent = findParent<TRaceFeature>(
          feature,
          feat,
          item.parent
        )
        astArray<TRaceBlock, TRaceFeature>(
          parent,
          ESectionType.empty,
          ast
        )
        break
      }
      case ESectionType.comment: {
        const parent = findParent<TRaceFeature>(
          feature,
          feat,
          item.parent
        )
        astArray<TRaceBlock, TRaceFeature>(
          parent,
          ESectionType.comments,
          ast
        )
        break
      }
      case ESectionType.rule: {
        const parent = findParent<TRaceFeature>(
          feature,
          feat,
          item.parent
        )
        astArray<TRaceRule, TRaceFeature>(
          parent,
          ESectionType.rules,
          ast
        )
        break
      }
      case ESectionType.scenario: {
        const parent = findParent<TRaceScenarioParent>(
          feature,
          feat,
          item.parent
        )
        astArray<TRaceScenario, TRaceScenarioParent>(
          parent,
          ESectionType.scenarios,
          ast
        )
        break
      }
    }

    return feat
  }, {...feature} as TRaceFeature)
}