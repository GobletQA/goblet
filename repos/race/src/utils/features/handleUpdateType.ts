import type {
  TRaceFeature,
  TUpdateFeatureOpts,
} from '@GBR/types'
import type { TExpanded, TOnExpandedCB } from '@GBR/contexts'

import { EUpdateType } from '@GBR/types'
import { emptyObj, get } from '@keg-hub/jsutils'

import { generateId } from '@GBR/utils/helpers/generateId'

export type THandleUpdateType = TUpdateFeatureOpts & {
  expanded:TExpanded
  updated: TRaceFeature
  feature?: TRaceFeature
  updateExpanded:TOnExpandedCB
  changed?: Partial<TRaceFeature>
}

export const handleUpdateType = (props:THandleUpdateType) => {
  const {
    op,
    type,
    path,
    replace,
    updated,
    expanded,
    updateExpanded
  } = props

  // Handle different update types
  if(op === EUpdateType.add){
    const prop = path ? get(updated, path) : emptyObj
    prop?.uuid && updateExpanded(generateId(updated, prop, type), true)
  }

  else if(op === EUpdateType.remove){
    
  }

  else if(op === EUpdateType.update){
    
  }

}
