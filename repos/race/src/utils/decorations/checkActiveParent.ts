import type { TRaceDeco, TRaceDecoMeta } from '@GBR/types'


import { EAstObject } from '@ltipton/parkin'


export const checkActiveParent = (
  deco:TRaceDeco,
  meta:TRaceDecoMeta
) => {
  return meta.action === `start`
    && (deco.type === EAstObject.scenario || deco.type === EAstObject.background)
}
