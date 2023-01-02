
import type { ReactNode } from 'react'

import { EEditKey } from '@GBR/types'
import { useEditing } from '@GBR/contexts'
import { Button } from '@gobletqa/components'
import { cls, capitalize } from '@keg-hub/jsutils'
import {
  TextInput,
  TextLabelWrap,
  TextInputLabel,
  TextInputControl,
  TextInputContainer,
} from './Form.styled'

export type TTextEdit = {
  id:string
  label:string
  text:string
  isError?:boolean
  className?:string
  isEditing?:boolean
  children:ReactNode
  multiline?:boolean
  placeholder?:string
  helperText?: string
  editKey:EEditKey|EEditKey[]
}

type TEditActions = {
  editing?:boolean
  editKey:EEditKey|EEditKey[]
}

// TODO: fix this to loop over the editKeys and set each one as needed
const TextEditActions = (props:TEditActions) => {
  const {setEditing} = useEditing()
  const { editKey, editing } = props
  
  return (
    <>
      <Button
        variant='outlined'
        onClick={() => setEditing({ key: editKey, value: !editing })}
      >
        Edit
      </Button>
    </>
  )
}

export const TextEdit = (props:TTextEdit) => {
  const {
    id,
    label,
    text=``,
    isError,
    editKey,
    children,
    isEditing,
    className,
    multiline,
    helperText,
    placeholder,
  } = props


  return !isEditing
    ? (
        <>
          {children}
          <TextEditActions editKey={editKey} editing={isEditing} />
        </>
      )
    : (
        <>
          <TextInputControl>
            <TextInputContainer className='gr-text-input-container' >
              <TextLabelWrap className='gr-text-input-label-wrap' >
                <TextInputLabel
                  htmlFor={id}
                  shrink={false}
                >
                  {capitalize(label)}
                </TextInputLabel>
              </TextLabelWrap>
              <TextInput
                size='small'
                value={text}
                multiline={multiline}
                helperText={helperText}
                className={cls('gr-text-input', className)}
                placeholder={placeholder || "Enter some text..."}
              />
            </TextInputContainer>
          </TextInputControl>
          <TextEditActions editKey={editKey} editing={isEditing} />
        </>
      )
}