import type { TJokerReq } from '@gobletqa/joker'

import { fixFeature } from './fixFeature'
import { askQuestion } from './askQuestion'
import { EJokerAction } from '@gobletqa/joker'
import { generateFeature } from './generateFeature'
import { stepFromBrowserAndPrompt } from './stepFromBrowserAndPrompt'
import { featureFromBrowserAndStory } from './featureFromBrowserAndStory'



const JokerActions = {
  [EJokerAction.Question]: askQuestion,
  [EJokerAction.FixFeature]: fixFeature,
  [EJokerAction.GenerateFeature]: generateFeature,
  [EJokerAction.StepFromBrowserAndPrompt]: stepFromBrowserAndPrompt,
  [EJokerAction.FeatureFromBrowserAndStory]: featureFromBrowserAndStory,
}

export const jokerAction = async (props:TJokerReq) => {
  const method = props.action && JokerActions[props.action]
  if(!method) throw new Error(`Unknown Joker action ${props.action}`)

  return await method(props)

}