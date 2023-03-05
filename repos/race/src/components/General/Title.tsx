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
  type:ESectionType
  helperText?:string
  variant?:TInputVariants
  onChange:TChangeCB
}

export const Title = (props:TTitle) => {
  const {
    id,
    uuid=id,
    name,
    type,
    label,
    variant,
    onChange,
    value=``,
    helperText,
  } = props

  return (
    <InputContainer className={`gr-${type}}-title gr-${type}-input-container`} >
      <InlineInput
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
        placeholder={`${capitalize(type)} title or name...`}
      />
    </InputContainer>
  )
}