
import type { TRaceFeature, TFeaturesRef } from '@GBR/types'
import type { TChangeCB, TInputVariants } from '@gobletqa/components'

import { useCallback } from 'react'

import { InputContainer } from '../Section'
import { InlineInput } from '@gobletqa/components'
import { updateFeature } from '@GBR/actions/feature/updateFeature'

export type TTitle = {
  name?:string
  parent:TRaceFeature
  helperText?:string
  variant?:TInputVariants
  initialEditing?:boolean
  featuresRef:TFeaturesRef
}

export const Title = (props:TTitle) => {
  const {
    name,
    parent,
    variant,
    helperText,
  } = props

  const { feature, uuid } = parent

  const onChange = useCallback(((evt, value) => {
    updateFeature({ ...parent, feature: value || evt.target.value })
  }) as TChangeCB, [parent, feature])

  return (
    <InputContainer className='gr-feature-title gr-feature-input-container' >
      <InlineInput
        label={`Title`}
        required={true}
        value={feature}
        multiline={true}
        variant={variant}
        onChange={onChange}
        id={`${uuid}-title`}
        helperText={helperText}
        className='gr-feature-title'
        name={name || `feature-title`}
        initialEditing={!Boolean(feature)}
        placeholder='Feature title or name...'
      />
    </InputContainer>
  )
}