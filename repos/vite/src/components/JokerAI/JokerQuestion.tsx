import type { MouseEvent, FocusEvent, RefObject } from 'react'

import { cls } from '@keg-hub/jsutils'
import { WSCancelJokerReqEvt } from '@constants'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import {
  JokerQInput,
  JokerQSubmit,
  JokerQSubIcon,
  JokerQContainer,
  JokerQCancelIcon,
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

const onCancel = () => EE.emit(WSCancelJokerReqEvt)

export const JokerQuestion = (props:TJokerQuestion) => {

  const {
    rows,
    onBlur,
    onClick,
    loading,
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
          variant={`contained`}
          text={loading ? `Cancel` : `Submit`}
          color={loading ? `error` : `primary`}
          onClick={loading ? onCancel : onClick}
          Icon={loading ? JokerQCancelIcon : JokerQSubIcon}
          className={cls(
            loading && `loading`,
            `gb-joker-submit-button`
          )}
        />
      </JokerQSubmitContainer>
    </JokerQContainer>
  )
  
}