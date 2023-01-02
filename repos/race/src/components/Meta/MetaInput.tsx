import type { ComponentProps } from 'react'
import { EMetaType } from '@GBR/types'
import { TextFieldProps } from '@mui/material'
import { TextInputProps } from '@GBR/constants'
import { cls, emptyArr, capitalize, pickKeys } from '@keg-hub/jsutils'
import {
  MetaLabel,
  MetaLabelWrap,
  MetaAutoComp,
  MetaInputComp,
  MetaFormControl,
  MetaInputContainer,
} from './Meta.styled'

export type TMetasInput = Omit<
  ComponentProps<typeof MetaAutoComp>,
  `renderInput`|`options`
> & {
  inputType?:`auto`|`text`
  label?:string
  type:EMetaType
  options?:string[]
  isError?: boolean
  multiline?:boolean
  placeholder?:string
  helperText?: string
}

export const MetaInput = (props:TMetasInput) => {
  const {
    type,
    label,
    value,
    isError,
    multiline,
    inputType,
    className,
    helperText,
    placeholder,
    options=emptyArr,
    ...rest
  } = props

  return (
    <MetaFormControl>
      
      <MetaInputContainer className='gr-meta-input-container' >

        <MetaLabelWrap className='gr-meta-input-label-wrap' >
          <MetaLabel
            shrink={false}
            htmlFor={rest.id}
            id={`label-${rest.id}`}
          >
            {capitalize(label || type)}
          </MetaLabel>
        </MetaLabelWrap>

        {
          inputType === `text`
            ? (
                <MetaInputComp
                  size='small'
                  multiline={multiline}
                  helperText={helperText}
                  className={cls('gr-meta-input', className)}
                  placeholder={placeholder || "Select an option..."}
                  {...pickKeys<TextFieldProps>(rest, TextInputProps)}
                />
              )
            : (
                <MetaAutoComp
                  freeSolo
                  size='small'
                  options={options}
                  className={cls('gr-meta-auto-input', className)}
                  {...rest}
                  renderInput={(params) => (
                    <MetaInputComp
                      multiline={multiline}
                      helperText={helperText}
                      className={cls('gr-meta-input', className)}
                      {...params}
                      placeholder={placeholder || "Select an option..."}
                    />
                  )}
                />
              )
        }
      </MetaInputContainer>
    </MetaFormControl>
  )
}
