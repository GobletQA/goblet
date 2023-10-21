import type { TJokerStepReq } from '@types'

import { EJokerAction } from '@types'
import { useRef, useState } from 'react'
import { nanoid } from '@keg-hub/jsutils'
import { WSCancelJokerReqEvt } from '@constants'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { UrlInput } from '@components/Forms/Inputs/UrlInput'
import { JokerActionContainer } from './JokerActions.styled'
import { jokerRequest } from '@actions/joker/socket/jokerRequest'
import { useForceUpdate, useEffectOnce, useInline } from '@gobletqa/components'

import {
  SubmitBtn,
  CancelIcon,
  SubmitIcon,
  InputPrompt,
  FormContainer,
  InputContainer,
  InputHelperText,
} from './StepFromBPAction.styled'
import {cls} from '@keg-hub/jsutils'


const onCancel = () => EE.emit(WSCancelJokerReqEvt, {})

export type TStepFromBPAction = {
  
}

const testVals = {
  url: `https://www.gobletqa.com/`,
  prompt: `Enter the email "lance@gobletqa.com" into the input and click the Request demo button`
}

const urlInputProps = {
  label: `Page URL`,
  name: `web-page-url`,
  className: `gb-joker-web-page-url`,
  placeholder: `URL of the page where the step will be executed`,
  helperText: (
    <InputHelperText>
      To ensure valid step is created, the URL's page content is added as context to the prompt.
    </InputHelperText>
  ),
}


const useStepForm = () => {

  const urlRef = useRef<HTMLInputElement>()
  const promptRef = useRef<HTMLInputElement>()

  const buttonRef = useRef<any>()
  const [loading, setLoading] = useState<boolean>(false)
  const onSubmit = useInline(async () => {

    setLoading(true)

    await jokerRequest({
      id: nanoid(),
      data: { url: urlRef?.current?.value },
      text: promptRef?.current?.value || ``,
      action: EJokerAction.StepFromBrowserAndPrompt,
    } as TJokerStepReq)

    setLoading(false)

  })

  return {
    urlRef,
    loading,
    onSubmit,
    onCancel,
    promptRef,
    buttonRef,
    disabled: Boolean(!urlRef?.current?.value || !promptRef?.current?.value)
  }

}


export const StepFromBPAction = (props:TStepFromBPAction) => {

 const {
    urlRef,
    loading,
    onSubmit,
    promptRef,
    buttonRef,
    disabled,
 } = useStepForm()


  // There's a bug in mui that causes a waring when this is set to 0 by default
  // So we have to set to 0, after it's rendered
  const [rows, setRows] = useState(10)
  useEffectOnce(() => setRows(2))
  const forceUpdate = useForceUpdate()

  return (
    <JokerActionContainer className='gb-joker-action-step-container' >
      <FormContainer className='gb-joker-action-form-container'>
      
        <InputContainer className='gb-joker-action-url-input-container' >
          <UrlInput
            inputRef={urlRef}
            onBlur={forceUpdate}
            value={testVals.url || urlRef.current?.value || ``}
            {...urlInputProps}
          />
        </InputContainer>

        <InputContainer className='gb-joker-action-prompt-input-container' >
          <InputPrompt
            rows={rows}
            multiline={true}
            inputRef={promptRef}
            label={`Step Prompt`}
            onBlur={forceUpdate}
            value={testVals.prompt || promptRef?.current?.value || ``}
            className='gb-joker-action-prompt-input'
            placeholder='Enter the action you would like the step execute...'
          />
        </InputContainer>

        <InputContainer className={cls(`gb-joker-action-url-input-container`, `align-right`)} >
          <SubmitBtn
            ref={buttonRef}
            required={true}
            disabled={disabled}
            variant={`contained`}
            text={loading ? `Cancel` : `Submit`}
            color={loading ? `error` : `primary`}
            onClick={loading ? onCancel : onSubmit}
            Icon={loading ? CancelIcon : SubmitIcon}
            className={cls(
              loading && `loading`,
              `gb-joker-action-submit-button`
            )}
          />
        </InputContainer>

      </FormContainer>
    </JokerActionContainer>
  )
  
}
