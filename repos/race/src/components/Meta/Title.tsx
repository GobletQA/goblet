
import type { TRaceFeature, TFeaturesRef } from '@GBR/types'
import type { TToggleEditCB, TChangeCB, TInputVariants } from '@gobletqa/components'

import { useCallback } from 'react'

import { isStr } from '@keg-hub/jsutils'
import { InputContainer } from '../Shared'
import { Input } from '@gobletqa/components'
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

  const onToggleEdit = useCallback(((__, featureTitle, editing) => {
    !editing
      && isStr(featureTitle)
      && updateFeature({ ...parent, feature: featureTitle})
  }) as TToggleEditCB, [parent])

  const onChange = useCallback(((evt, value) => {
    
  }) as TChangeCB, [parent])

  return (
    <InputContainer className='gr-feature-title gr-feature-input-container' >
      <Input
        label={`Title`}
        required={true}
        value={feature}
        multiline={true}
        variant={variant}
        onChange={onChange}
        id={`${uuid}-title`}
        helperText={helperText}
        onToggleEdit={onToggleEdit}
        className='gr-feature-title'
        name={name || `feature-title`}
        initialEditing={!Boolean(feature)}
        placeholder='Feature title or name...'
      />
    </InputContainer>
  )
}