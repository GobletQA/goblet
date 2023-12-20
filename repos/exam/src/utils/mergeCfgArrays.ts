import type { TExamCliOpts } from "@GEX/types/bin.types"
import type { TExamConfig } from '@GEX/types/exam.types'

import { isStr } from '@keg-hub/jsutils/isStr'
import { isArr } from '@keg-hub/jsutils/isArr'
import { exists } from '@keg-hub/jsutils/exists'
import { ExamCfgArrayItems } from '@gobletqa/environment/constants'


const validateArr = (arr:any|any[], allowStr:boolean=true) => {
  if(!exists(arr)) return undefined 

  if(isArr(arr) && arr?.length) return arr
  if(isStr(arr) && allowStr) return [arr]

  return undefined
}

/**
 * Hard override, similar to how Jest does it
 * If the override array exists, it replaces the base
 * It does not merge with it
 */
const pickArray = (arr1?:any|any[], arr2?:any|any[], allowStr:boolean=true) => {
  return validateArr(arr2, allowStr) || validateArr(arr1, allowStr)
}

export const mergeCfgArrays = (
  base:Partial<TExamCliOpts>,
  override:Partial<TExamCliOpts>
):Partial<TExamConfig> => {
  return ExamCfgArrayItems.reduce((acc, key) => {
    const found = pickArray(base[key], override[key])
    isArr(found) && (acc[key] = found)

    return acc
  }, {} as Partial<TExamConfig>)

}
