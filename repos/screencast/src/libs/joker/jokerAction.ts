import type { TJokerReq } from '@gobletqa/joker'

import { fixFeature } from './fixFeature'
import { askQuestion } from './askQuestion'
import { EJokerAction } from '@gobletqa/joker'
import { generateFeature } from './generateFeature'

export const jokerAction = async (props:TJokerReq) => {
  switch(props.action){
    case EJokerAction.Question:
      return await askQuestion(props)
    case EJokerAction.GenerateFeature:
      return await generateFeature(props)
    case EJokerAction.FixFeature:
      return await fixFeature(props)
    default:
      throw new Error(`Unknown Joker action ${props.action}`)
  }

}