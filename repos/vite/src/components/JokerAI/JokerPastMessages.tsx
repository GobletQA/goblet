import type {ReactNode} from 'react'
import type { TJokerMessage } from '@types'

import {
  EJokerAction,
  EJokerMessageType
} from '@types'

import {useJoker} from '@store'
import { JokerMessage } from './JokerMessage'
import { JokerMessages, JokerMessagesList } from './JokerFeature.styled'

export type TJokerPastMessages = {
  message?:TJokerMessage[]
}

export const JokerPastMessages = (props:TJokerPastMessages) => {
  const { messages } = useJoker()

  return (
    <JokerMessages
      className='gb-joker-messages'
    >
      <JokerMessagesList className='gb-joker-messages-list' >
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
      </JokerMessagesList>
    </JokerMessages>
  )
}
