import type { TBackgroundAst } from '@ltipton/parkin'
import type { TBackgroundParentAst } from '@GBR/types'


export type TFoundBackground = {
  background?:TBackgroundAst
}

export const findBackground = (
  parent:TBackgroundParentAst,
) => {
  // TODO find background from ID looking on features and feature.rules

  const background = parent?.background
  return {
    background,
  } as TFoundBackground
}