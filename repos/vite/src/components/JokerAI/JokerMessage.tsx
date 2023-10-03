import type {ReactNode} from 'react'
import type { TJokerMessage } from '@types'

import { EJokerMessageType } from '@types'
import { JokerMessageActions } from './JokerMessageActions'

import {
  JokerMessageText,
  JokerMessageContent,
  JokerMessageIconJoker,
  JokerMessageIconUser,
  JokerMessageContainer,
  JokerMessageTextContainer,
  JokerMessageIconContainer,
} from './JokerMessage.styled'
import {cls} from '@keg-hub/jsutils'

export const JokerMessage = (props:TJokerMessage) => {
  const {
    text,
    type,
    actions
  } = props


  return (
    <JokerMessageContainer className={cls(
      `gb-joker-message-container`,
      `gb-joker-message-container-${type}`,
    )}>

      <JokerMessageContent
        className={cls(
          `gb-joker-message-content`,
          `gb-joker-message-${type}`,
        )}
      >
      
        <JokerMessageIconContainer>
          {
            type === EJokerMessageType.Joker
              ? (<JokerMessageIconJoker />)
              : (<JokerMessageIconUser />)
          }
        </JokerMessageIconContainer>
      
        <JokerMessageTextContainer className='gb-joker-message-text-container' >
          <JokerMessageText className='gb-joker-message-text' >
            {text}
          </JokerMessageText>
        </JokerMessageTextContainer>

      </JokerMessageContent>

      <JokerMessageActions {...props} />
    </JokerMessageContainer>
  )
}

