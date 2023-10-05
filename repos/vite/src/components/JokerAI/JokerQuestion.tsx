import {cls} from '@keg-hub/jsutils'
import type { MouseEvent, FocusEvent, RefObject } from 'react'
import {
  JokerQInput,
  JokerQSubmit,
  JokerQContainer,
  JokerQInputContainer,
  JokerQSubmitContainer,
} from './JokerFeature.styled'

export type TJokerQuestion = {
  rows?:number
  question?:string
  loading?:boolean
  onBlur?:(evt:FocusEvent) => void
  buttonRef?:RefObject<HTMLButtonElement>
  onClick?:(evt:MouseEvent<HTMLButtonElement>) => void
  inputRef?:RefObject<HTMLInputElement | HTMLTextAreaElement | undefined>
}

export const JokerQuestion = (props:TJokerQuestion) => {

  const {
    rows,
    onBlur,
    onClick,
    loading,
    question,
    inputRef,
    buttonRef,
  } = props

  return (
    <JokerQContainer
      className='gb-joker-q-container'
    >
      <JokerQInputContainer
        className='gb-joker-q-input-container'
      >
        <JokerQInput
          rows={rows}
          onBlur={onBlur}
          multiline={true}
          inputRef={inputRef}
          value={inputRef?.current?.value || ``}
          className='gb-joker-messages-q-input'
          placeholder='Ask Joker a question...'
        />

      </JokerQInputContainer>

      <JokerQSubmitContainer
        className='gb-joker-submit-container'
      >
        <JokerQSubmit
          ref={buttonRef}
          onClick={onClick}
          variant={`contained`}
          disabled={loading || !question}
          text={loading ? `Loading` : `Submit`}
          className={cls(
            loading && `loading`,
            `gb-joker-submit-button`
          )}
        />
      </JokerQSubmitContainer>
    </JokerQContainer>
  )
  
}