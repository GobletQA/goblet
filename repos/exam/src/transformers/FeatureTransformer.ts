
import type { ITransform } from "@GEX/types"
import type { TExecCtx } from "@GEX/types"

import type { TFeatureAst, TParkinRunStepOptsMap } from '@ltipton/parkin'


type TFeatureData = {
  steps?:TParkinRunStepOptsMap
}


export class FeatureTransformer implements ITransform {
  transform = async (content:string, ctx: TExecCtx<TFeatureData>) => {

  }
}