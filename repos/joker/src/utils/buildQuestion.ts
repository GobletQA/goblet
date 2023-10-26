import type {
  TQMsg,
  TQuestion,
  TJokerAsk,
  TSystemMsg,
} from '@GJK/types'

import { isStr } from '@keg-hub/jsutils/isStr'
import { exists } from '@keg-hub/jsutils/exists'
import { nanoid } from '@keg-hub/jsutils/nanoid'
import { emptyArr } from '@keg-hub/jsutils/emptyArr'

export const buildQuestion = (
  args:TJokerAsk|string,
  system:TSystemMsg[]=emptyArr
):TQuestion => {
  if(isStr(args)) return { messages: [args], id: nanoid() }

  const {
    q,
    question,
    qs=emptyArr,
    questions=emptyArr,
    ...rest
  } = args

  return {
    ...rest,
    messages: [
      ...system,
      ...([q, question, ...qs, ...questions]).reduce((acc, quest) => {
        exists(quest) && acc.push(quest)
        return acc
      }, [] as TQMsg[])
    ]
  }

}