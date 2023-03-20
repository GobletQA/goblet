
import type { TRaceFeature, TRaceParentAst } from '@GBR/types'
import type { EBlockLoc, EStepType, EAstObject, TParentAst, TFeatureAst } from '@ltipton/parkin'

import { getParkin } from '@GBR/contexts/ParkinContext'

export type TFindIndex = {
  loc?:EBlockLoc|string
  type:EAstObject|EStepType
  parent:TParentAst|TRaceParentAst
  feature:TFeatureAst|TRaceFeature
}

export const findIndex = (props:TFindIndex) => {
  const parkin = getParkin()

  return parkin.assemble.findIndex({
    ...props,
    parent: props.parent as TParentAst,
    feature: props.feature as TFeatureAst,
  })
}