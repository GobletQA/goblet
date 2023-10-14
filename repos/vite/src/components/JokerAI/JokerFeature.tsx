import type { FocusEvent } from 'react'

import {nanoid} from '@keg-hub/jsutils'
import { useRef, useState } from 'react'
import { JokerQuestion } from './JokerQuestion'
import { JokerPastMessages } from './JokerPastMessages'
import {useEffectOnce, useInline} from '@gobletqa/components'
import { jokerRequest } from '@actions/joker/socket/jokerRequest'
import {
  JokerFeatureContainer,
  JokerMessagesContainer,
} from './JokerFeature.styled'


export type TJokerFeature = {}


export const JokerFeature = (props:TJokerFeature) => {

  const buttonRef = useRef<HTMLButtonElement>(undefined as any)
  const inputRef = useRef<HTMLInputElement|HTMLTextAreaElement|undefined>()
  const [question, setQuestion] = useState(``)
  const [loading, setLoading] = useState(false)

  // Auto focus the button element on blur of the question input
  const onBlur = useInline((evt:FocusEvent) => {
    const val = (inputRef?.current?.value || ``).trim()
    setQuestion(val)
    val && setTimeout(() => buttonRef?.current?.focus?.(), 100)
  })

  const onClick = useInline(async () => {
    if(!inputRef?.current) return
    
    const text = inputRef?.current?.value
    if(!text) return

    // Reset the input on submit to the backend
    inputRef.current.value = ``

    setLoading(true)
    await jokerRequest({
      text,
      id: nanoid(),
    })
    setLoading(false)

    buttonRef?.current?.blur?.()
  })

  // There's a bug in mui that causes a waring when this is set to 0 by default
  // So we have to set to 0, after it's rendered
  const [rows, setRows] = useState(10)
  useEffectOnce(() => setRows(0))

  return (
    <JokerFeatureContainer
      className='gb-joker-messages-feature-container'
    >
      <JokerMessagesContainer
        className='gb-joker-messages-container'
      >
        <JokerPastMessages />
      </JokerMessagesContainer>

      <JokerQuestion
        rows={rows}
        onBlur={onBlur}
        loading={loading}
        onClick={onClick}
        question={question}
        inputRef={inputRef}
        buttonRef={buttonRef}
      />
    </JokerFeatureContainer>
  )

}
