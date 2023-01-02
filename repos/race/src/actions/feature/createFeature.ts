import type { TRaceFeature } from '@GBR/types'


import { SetFeatureContextEvt } from '@GBR/constants'
import { EE } from '@gobletqa/shared/libs/eventEmitter'



export const createFeature = (feat:Partial<TRaceFeature>, rootLoc:string) => {
  if(!rootLoc.length)
    return console.warn(`Root location is required to create a new feature`)


/**
  uuid: string
  path:string
  title:string
  tags?: string[]
  feature: string
  content: string
  reason?: TAstBlock
  desire?: TAstBlock
  rules?: TRuleAst[]
  comments: TAstBlock[]
  parent: TFeatureParent
  perspective?: TAstBlock
  scenarios: TScenarioAst[]
  background?: TBackgroundAst

 */

  console.log(`------- create feature -------`)
  // EE.emit<TRaceFeature>(SetFeatureContextEvt, featureFactory(feat))

}