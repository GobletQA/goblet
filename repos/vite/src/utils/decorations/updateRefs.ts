import type { MutableRefObject } from 'react'
import type {
  TPlayerResEvent,
  TPlayerEventData,
} from '@types'

import { getTypeFromId } from '@utils/decorations/getTypeFromId'

type TUpdateRefs = {
  event?:TPlayerResEvent
  clear?:boolean
  type?:`step`|`scenario`|`feature`
  stepRef:MutableRefObject<TPlayerEventData|undefined>
  featureRef:MutableRefObject<TPlayerEventData|undefined>
  scenarioRef:MutableRefObject<TPlayerEventData|undefined>
}

export const updateRefs = ({
  type,
  event,
  clear,
  stepRef,
  featureRef,
  scenarioRef,
}:TUpdateRefs) => {
  if(clear){
    stepRef.current = undefined
    featureRef.current = undefined
    scenarioRef.current = undefined
  }
  if(!event) return

  type = type || getTypeFromId(event.data)

  switch(type){
    case `step`: {
      stepRef.current = event.data
      break
    }
    case `scenario`: {
      scenarioRef.current = event.data
      break
    }
    case `feature`: {
      featureRef.current = event.data
      break
    }
  }
}
