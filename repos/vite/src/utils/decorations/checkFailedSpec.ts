import type { MutableRefObject } from 'react'
import type { TRaceDeco, TRaceDecoAdd } from '@gobletqa/race'
import type { TDecoration, TDecorationAdd } from '@gobletqa/monaco'


import { EEditorType } from '@types'
import type {
  TPlayerResEvent,
  TPlayerEventData,
} from '@types'

import { PWPlay } from '@constants'
import { buildDecorationFrom } from '@utils/decorations/buildDecorationFrom'

type TUpdateDecs = {
  relative:string
  editor: EEditorType
  event:TPlayerResEvent
  add:TDecorationAdd|TRaceDecoAdd
  featureRef:MutableRefObject<TPlayerEventData|undefined>
  scenarioRef:MutableRefObject<TPlayerEventData|undefined>
}

export const checkFailedSpec = ({
  add,
  event,
  editor,
  relative,
  featureRef,
  scenarioRef,
}:TUpdateDecs) => {
  if(!event) return

  if(PWPlay.playSpecDone === event.name && !event.data.passed){
    
    const featDeco = featureRef.current
      && buildDecorationFrom(event.data, featureRef.current)

    if(featDeco)
      editor === EEditorType.code
        ? (add as TDecorationAdd)?.(
            relative,
            featDeco as TDecoration,
            { action: event.data.action }
          )
        : (add as TRaceDecoAdd)?.(
            relative,
            featDeco as TRaceDeco,
            { action: event.data.action }
          )

    const sceDeco = scenarioRef.current
      && buildDecorationFrom(event.data, scenarioRef.current)

    if(sceDeco)
      editor === EEditorType.code
        ? (add as TDecorationAdd)?.(
            relative,
            sceDeco as TDecoration,
            { action: event.data.action }
          )
        : (add as TRaceDecoAdd)?.(
            relative,
            sceDeco as TRaceDeco,
            { action: event.data.action }
          )
  }
}
