// import type { TJokerReq } from '@gobletqa/joker'
// import type { TJokerActExt } from '@GSC/types'

// import { askQuestion } from './askQuestion'
// import { EJokerAction } from '@gobletqa/joker'
// import { stepFromBrowserAndPrompt } from './stepFromBrowserAndPrompt'

// const JokerActions = {
//   [EJokerAction.Question]: askQuestion,
//   [EJokerAction.StepFromBrowserAndPrompt]: stepFromBrowserAndPrompt,
// }

// export const jokerAction = async (props:TJokerReq, ext:TJokerActExt) => {
//   const method = props.action && JokerActions[props.action]
//   if(!method) throw new Error(`Unknown Joker action ${props.action}`)

//   return await method(props, ext)

// }

export {}