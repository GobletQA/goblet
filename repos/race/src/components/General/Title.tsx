import type { CSSProperties } from 'react'
import type { TChangeCB, TInputVariants } from '@gobletqa/components'

import { ESectionType } from '@GBR/types'
import { InputContainer } from '../Section'
import { capitalize } from '@keg-hub/jsutils'
import { InlineInput } from '@gobletqa/components'

export type TTitle = {
  id?:string
  uuid?:string
  name?:string
  value?:string
  label?:string
  sx?:CSSProperties
  type:ESectionType
  helperText?:string
  onChange:TChangeCB
  variant?:TInputVariants
  containerSx?:CSSProperties
}

export const Title = (props:TTitle) => {
  const {
    id,
    sx,
    uuid=id,
    name,
    type,
    label,
    variant,
    onChange,
    value=``,
    helperText,
    containerSx
  } = props

  return (
    <InputContainer
      sx={containerSx}
      className={`gr-${type}}-title gr-${type}-input-container`}
    >
      <InlineInput
        inputSx={sx}
        label={label || `Title`}
        required={true}
        value={value}
        multiline={true}
        variant={variant}
        onChange={onChange}
        helperText={helperText}
        className={`gr-${type}-title`}
        name={name || `${type}-title`}
        id={`${uuid || (type + '-' + name)}-title`}
        placeholder={`${capitalize(type)} ${(label || 'title or name').toLowerCase()} ...`}
      />
    </InputContainer>
  )
}