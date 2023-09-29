import type { TExEventData } from "@GEX/types"

import { emptyObj } from "@keg-hub/jsutils/emptyObj"
import { BuiltTestResultFailed, NoTestsFoundPass } from "@GEX/constants"

type TBuildResult = Partial<TExEventData> & {
  id:string
  testPath:string
  fullName:string
  description:string
}

const emptyBuildResult = emptyObj as TBuildResult

export const buildNoTestsResult = (result:TBuildResult=emptyBuildResult) => {
  return {
    ...NoTestsFoundPass,
    describes: [],
    timestamp: new Date().getTime(),
    ...result,
  } as TExEventData
}


export const buildFailedTestResult = (result?:TBuildResult) => {
  return {
    ...BuiltTestResultFailed,
    describes: [],
    timestamp: new Date().getTime(),
    ...result,
  } as TExEventData
}
