import type { MutableRefObject } from 'react'

import { EEditorType } from '@types'
import type {
  TBuiltDeco,
  TPlayerResEvent,
  TPlayerEventData,
} from '@types'

import { PWPlay } from '@constants'
import { buildDecorationFrom } from '@utils/decorations/buildDecorationFrom'

type TUpdateDecs<
E=EEditorType
> = {
  editor: E
  event:TPlayerResEvent
  featureRef:MutableRefObject<TPlayerEventData|undefined>
  scenarioRef:MutableRefObject<TPlayerEventData|undefined>
}

export const checkFailedSpec = <
  E=EEditorType,
  R=TBuiltDeco
>({
  event,
  featureRef,
  scenarioRef,
}:TUpdateDecs<E>):R[] => {
  let decos = [] as R[]

  if(!event || event.name !== PWPlay.playSpecDone || event.data.passed) return decos

  const featDeco = featureRef.current
    && buildDecorationFrom(event.data, featureRef.current)

  const sceDeco = scenarioRef.current
    && buildDecorationFrom(event.data, scenarioRef.current)

  featDeco && decos.push(featDeco as R)
  sceDeco && decos.push(sceDeco as R)

  return decos
}
