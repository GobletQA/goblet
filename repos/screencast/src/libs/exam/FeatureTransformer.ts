
import type { TExTransformOpts, TExecCtx } from "@gobletqa/exam"
import { ExamTransformer } from "@gobletqa/exam"

import type { TFeatureAst, TParkinRunStepOptsMap } from '@ltipton/parkin'


type TFeatureData = {
  steps?:TParkinRunStepOptsMap
}

export class FeatureTransformer implements ExamTransformer {

  options:TExTransformOpts={}

  transform = async (content:string, ctx: TExecCtx<TFeatureData>) => {

  }
}