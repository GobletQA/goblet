import type { TPlayerTestEvent } from '@types'

import { ERaceDecoType } from '@gobletqa/race'
import { EAstObjects, EPlayerTestAction } from '@types'

const decoTypeFromItemType = (event:TPlayerTestEvent,type:string)=> {
  const { failed, passed } = event

  switch(type){
    case EAstObjects.feature: {
      if(failed) return ERaceDecoType.error
      if(passed) return ERaceDecoType.success

      return ERaceDecoType.unknown
    }
    default: {
      if(failed) return ERaceDecoType.fail
      if(passed) return ERaceDecoType.pass

      return ERaceDecoType.unknown
    }
  }
}


export const getDecoType = (event:TPlayerTestEvent, type:string) => {
  const { action, failed, passed } = event

  switch(action){
    case EPlayerTestAction.start:{
      return ERaceDecoType.spin
    }
    case EPlayerTestAction.end:{
      return decoTypeFromItemType(event, type)
    }
    default: {
      if(failed) return ERaceDecoType.fail
      if(passed) return ERaceDecoType.pass

      return ERaceDecoType.unknown
    }
  }

}