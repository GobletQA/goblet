import type {
  TRaceBlock,
  TRaceFeature,
  TRaceParentAst,
  TRaceStepParent,
  TRaceScenarioParent,
  TRaceBackgroundParent,
} from '@GBR/types'
import { ESectionType } from '@GBR/types'
import { emptyArr } from '@keg-hub/jsutils'

export type TFindNextIndex = {
  type:ESectionType
  feature:TRaceFeature
  parent:TRaceParentAst
}

/**
 * Checks all empty and comment block types for a matching index
 * If a match if found then add 1 to the index and check again
 * This ensures we don't overwrite an existing comment or empty line
 *
 */
const checkBlocks = (blocks:TRaceBlock[], idx:number):number => {
  const filtered = blocks.filter(block => block.index <= idx)
  const match = filtered.find(block => block.index === idx)

  return match ? checkBlocks(filtered, idx + 1) : idx
}

const validateIndex = (
  feature:TRaceFeature,
  index:number
) => {
   return checkBlocks(
    [
    ...(feature.empty || emptyArr),
    ...(feature.comments || emptyArr)
  ], index)
}

/**
  // Get the parent index, and add the step length to it
  // So parent == 4 + step length == 2 + 1, next index is 7
  // Index is global, but stepParent.steps is local
  // So add 1 because we don't count the 0 index at local
  // Validate the index with the feature blocks
  // Ensure we don't overwrite a comment of empty line
 */
export const findNextIndex = ({
  type,
  parent,
  feature,
}:TFindNextIndex) => {
  switch(type){
    case ESectionType.comments: {
      if(feature.comments){
        const lastComment = feature.comments[feature.comments.length - 1]
        return validateIndex(feature, lastComment.index + 1)
      }
      // If no empty exist, add it to the end
      const contentSplit = feature.content.split(`\n`)
      return validateIndex(feature, contentSplit.length)
    }
    case ESectionType.empty: {
      if(feature.empty){
        const lastEmpty = feature.empty[feature.empty.length - 1]
        return validateIndex(feature, lastEmpty.index + 1)
      }

      // If no empty exist, add it to the end
      const contentSplit = feature.content.split(`\n`)
      return validateIndex(feature, contentSplit.length)
    }
    case ESectionType.background: {
      const backParent = parent as TRaceBackgroundParent
      return backParent.background
        ? validateIndex(feature, backParent.background.index)
        : validateIndex(feature, backParent.index + 1)
    }
    case ESectionType.rules: {
      const feat = parent as TRaceFeature
      
      const idx = feat?.rules?.length
        ? feat.rules[feat.rules.length - 1].index + 1
        : feat.index + 1

      return validateIndex(feature, idx)
    }
    case ESectionType.scenarios: {
      const scenarioParent = parent as TRaceScenarioParent
      
      const idx = scenarioParent?.scenarios?.length
        ? scenarioParent.scenarios[scenarioParent.scenarios.length - 1].index + 1
        : scenarioParent.index + 1

      return validateIndex(feature, idx)
    }
    case ESectionType.steps: {
      const stepParent = parent as TRaceStepParent
      
      const idx = stepParent?.steps?.length
        ? stepParent.steps[stepParent.steps.length - 1].index + 1
        : stepParent.index + 1

      return validateIndex(feature, idx)
    }
  }
  

  
  
}