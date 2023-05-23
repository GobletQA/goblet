import type { MutableRefObject } from 'react'
import type {
  TPlayerResEvent,
  TPlayerEventData,
} from '@types'

import { getTypeFromId } from '@utils/decorations/getTypeFromId'

type TUpdateRefs<T=any> = {
  event?:TPlayerResEvent
  clear?:boolean
  type?:`step`|`scenario`|`feature`
  fileRef?:MutableRefObject<T|undefined>
  stepRef:MutableRefObject<TPlayerEventData|undefined>
  featureRef:MutableRefObject<TPlayerEventData|undefined>
  scenarioRef:MutableRefObject<TPlayerEventData|undefined>
}

export const updateRefs = <T=any>({
  type,
  event,
  clear,
  fileRef,
  stepRef,
  featureRef,
  scenarioRef,
}:TUpdateRefs<T>) => {
  if(clear){
    if(fileRef) fileRef.current = undefined

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
