import type { CSSProperties } from 'react'
import type { TChangeCB, TInputVariants } from '@gobletqa/components'

import { useRef, useEffect } from 'react'
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
  onBlur?:TChangeCB
  helperText?:string
  autoFocus?:boolean
  onChange?:TChangeCB
  variant?:TInputVariants
  containerSx?:CSSProperties
}

export const Title = (props:TTitle) => {
  const {
    id,
    sx,
    name,
    type,
    label,
    onBlur,
    variant,
    uuid=id,
    onChange,
    value=``,
    autoFocus,
    helperText,
    containerSx
  } = props

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  useEffect(() => {
    if(!autoFocus || !inputRef?.current) return

    inputRef?.current?.focus?.()
    inputRef?.current?.select?.()
  }, [])

  return (
    <InputContainer
      sx={containerSx}
      className={`gr-${type}}-title gr-${type}-input-container`}
    >
      <InlineInput
        inputSx={sx}
        value={value}
        required={true}
        onBlur={onBlur}
        multiline={true}
        variant={variant}
        inputRef={inputRef}
        onChange={onChange}
        helperText={helperText}
        label={label || `Title`}
        className={`gr-${type}-title`}
        name={name || `${type}-title`}
        id={`${uuid || (type + '-' + name)}-title`}
        placeholder={`${capitalize(type)} ${(label || 'title or name').toLowerCase()} ...`}
      />
    </InputContainer>
  )
}