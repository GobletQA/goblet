import {
  JokerQInput,
  JokerQSubmit,
  JokerQContainer,
  JokerQInputContainer,
  JokerFeatureContainer,
  JokerQSubmitContainer,
  JokerMessagesContainer,
} from './JokerFeature.styled'

import { JokerPastMessages } from './JokerPastMessages'

export type TJokerFeature = {
  
}

export const JokerFeature = (props:TJokerFeature) => {
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
            className='gb-joker-messages-q-input'
            placeholder='Ask Joker a question...'
          />

        </JokerQInputContainer>

        <JokerQSubmitContainer
          className='gb-joker-messages-submit-container'
        >
          <JokerQSubmit
            className='gb-joker-messages-submit-button'
            text={`Submit`}
            variant={`contained`}
          />
        </JokerQSubmitContainer>
      </JokerQContainer>

    </JokerFeatureContainer>
  )

}
