import {sendJkrMessage} from '@actions/joker/api/sendJkrMessage'
import {
  JokerQInput,
  JokerQSubmit,
  JokerQContainer,
  JokerQInputContainer,
  JokerFeatureContainer,
  JokerQSubmitContainer,
  JokerMessagesContainer,
} from './JokerFeature.styled'

import {
  EJokerAction,
  EJokerMessageType
} from '@types'
import { useRef } from 'react'
import { nanoid } from '@keg-hub/jsutils'
import { JokerPastMessages } from './JokerPastMessages'



export type TJokerFeature = {
  
}

export const JokerFeature = (props:TJokerFeature) => {
  
  const inputRef = useRef<HTMLInputElement>()
  
  return (
    <JokerFeatureContainer
      className='gb-joker-messages-feature-container'
    >

      <JokerMessagesContainer
        className='gb-joker-messages-container'
      >
        <JokerPastMessages />
      </JokerMessagesContainer>

      <JokerQContainer
        className='gb-joker-messages-q-container'
      >
        <JokerQInputContainer
          className='gb-joker-messages-q-input-container'
        >
          <JokerQInput
            inputRef={inputRef}
            className='gb-joker-messages-q-input'
            placeholder='Ask Joker a question...'
            value={inputRef?.current?.value || ``}
          />

        </JokerQInputContainer>

        <JokerQSubmitContainer
          className='gb-joker-messages-submit-container'
        >
          <JokerQSubmit
            className='gb-joker-messages-submit-button'
            text={`Submit`}
            variant={`contained`}
            onClick={() => {
              sendJkrMessage({
                id: nanoid(),
                type: EJokerMessageType.User,
                text: inputRef?.current?.value,
              })
            }}
          />
        </JokerQSubmitContainer>
      </JokerQContainer>

    </JokerFeatureContainer>
  )

}
