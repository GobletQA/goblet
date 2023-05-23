import type { MutableRefObject } from 'react'
import type { TRaceDeco, TRaceDecoAdd } from '@gobletqa/race'
import type { TDecoration, TDecorationAdd } from '@gobletqa/monaco'


import { EEditorType } from '@types'
import type {
  TBuiltDeco,
  TPlayerResEvent,
  TPlayerEventData,
} from '@types'

import { PWPlay } from '@constants'
import { buildDecorationFrom } from '@utils/decorations/buildDecorationFrom'

type TUpdateDecs<E=EEditorType, A=TDecorationAdd|TRaceDecoAdd> = {
  add:A
  editor: E
  relative:string
  event:TPlayerResEvent
  featureRef:MutableRefObject<TPlayerEventData|undefined>
  scenarioRef:MutableRefObject<TPlayerEventData|undefined>
}

export const checkFailedSpec = <
  E=EEditorType,
  A=TDecorationAdd|TRaceDecoAdd,
  D=TBuiltDeco
>({
  add,
  event,
  relative,
  featureRef,
  scenarioRef,
}:TUpdateDecs<E, A>) => {
  if(!event) return

  if(PWPlay.playSpecDone === event.name && !event.data.passed){

    const featDeco = featureRef.current
      && buildDecorationFrom(event.data, featureRef.current)

    // TODO: fix the types here
    featDeco && (add as any)(relative, featDeco, { action: event.data.action })

    const sceDeco = scenarioRef.current
      && buildDecorationFrom(event.data, scenarioRef.current)
    
    // TODO: fix the types here
    sceDeco && (add as any)(relative, sceDeco, { action: event.data.action })
  }

}
