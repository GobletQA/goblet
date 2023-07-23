import type {
  TRunContent,
  TFeatureData,
} from './FeatureRunner'
import type { TExCtx, TExTransformOpts } from "@gobletqa/exam"

import { ExamTransformer } from "@gobletqa/exam"

export class FeatureTransformer implements ExamTransformer<TRunContent, TFeatureData> {

  options:TExTransformOpts={}

  transform = async(content:string, ctx: TExCtx<TFeatureData>) => {

    // TODO: use parkin to convert to Feature AST
    return {} as TRunContent
  }
}