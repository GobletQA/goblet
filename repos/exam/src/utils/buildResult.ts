import type { TExEventData } from "@GEX/types"
import { BuiltTestResultFailed } from "@GEX/constants"

type TBuildResult = Partial<TExEventData> & {
  id:string
  testPath:string
  fullName:string
  description:string
}

export const buildResultFailed = (result:TBuildResult) => {
  return {
    ...BuiltTestResultFailed,
    describes: [],
    timestamp: new Date().getTime(),
    ...result,
  } as TExEventData
}
