import type {ReactNode} from 'react'
import type { TJokerMessage } from '@types'

import {
  EJokerAction,
  EJokerMessageType
} from '@types'

import { JokerMessage } from './JokerMessage'
import { JokerMessages } from './JokerFeature.styled'

export type TJokerPastMessages = {
  message?:TJokerMessage[]
}


const messages:TJokerMessage[] = [
  {
    id: 2,
    text: `Hey, can you help me write a feature file?`,
    type: EJokerMessageType.User,
    actions: []
  },
  {
    id: 3,
    text: `Sure, do you have a user story already written?`,
    type: EJokerMessageType.Joker,
    actions: []
  },
  {
    id: 4,
    text: `Yah, here you go:\n\n\`\`\`\nAs a user\nI want to search google.com\nSo that I can find what I'm looking for\n\n\`\`\``,
    type: EJokerMessageType.User,
    actions: []
  },
  {
    id: 1,
    type: EJokerMessageType.Joker,
    text: (<>Ok, click the <b>Generate</b> button to confirm</>),
    actions: [
      {
        label: `Cancel`,
        variant: `text`,
        id: EJokerAction.CancelAction,
        kind: EJokerAction.CancelAction,
      },
      {
        label: `Generate?`,
        id: EJokerAction.GenerateFeature,
        kind: EJokerAction.GenerateFeature,
      }
    ]
  },
  {
    id: 5,
    text: `Generating feature...`,
    type: EJokerMessageType.Joker,
    actions: []
  }
]

export const JokerPastMessages = (props:TJokerPastMessages) => {
  return (
    <JokerMessages
      className='gb-joker-messages'
    >
      {
        messages.map(message => {
          return (
            <JokerMessage
              {...message}
              key={message.id}
            />
          )
        })
      }
    </JokerMessages>
  )
}
