import type { MutableRefObject } from 'react'

import { EEditorType } from '@types'
import type {
  TBuiltDeco,
  TPlayerResEvent,
  TPlayerEventData,
} from '@types'

import { PWPlay } from '@constants'
import { buildDecorationFrom } from '@utils/decorations/buildDecorationFrom'

type TUpdateDecs = {
  editor: EEditorType
  event:TPlayerResEvent
  featureRef:MutableRefObject<TPlayerEventData|undefined>
  scenarioRef:MutableRefObject<TPlayerEventData|undefined>
}

export const checkFailedSpec = <R=TBuiltDeco>({
  event,
  editor,
  featureRef,
  scenarioRef,
}:TUpdateDecs):R[] => {
  let decos = [] as R[]

  if(!event || event.name !== PWPlay.playSpecDone || event.data.passed) return decos

  const featDeco = featureRef.current
    && buildDecorationFrom(event.data, featureRef.current, editor)

  const sceDeco = scenarioRef.current
    && buildDecorationFrom(event.data, scenarioRef.current, editor)

  featDeco && decos.push(featDeco as R)
  sceDeco && decos.push(sceDeco as R)

  return decos
}
