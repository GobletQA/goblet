import type { CSSProperties } from 'react'
import type { ESectionType, EEditKey } from '@GBR/types'
import type { TToggleEditCB, TChangeCB } from '@gobletqa/components'


import { Input } from '@gobletqa/components'

import { cls } from '@keg-hub/jsutils'
import { Header } from './Section.styled'
import { SectionActions } from './SectionActions'

export type TSectionHeader = {
  id?:string
  title:string
  label?:string
  gutter?:boolean
  name?:string
  className?:string
  type:ESectionType
  required?:boolean
  multiline?:boolean
  helperText?:string
  placeholder?:string
  onChange?:TChangeCB
  initialEditing?:boolean
  onToggleEdit?:TToggleEditCB
  actions?:Record<string, any>[]
  sx?:CSSProperties|CSSProperties[]
  variant?:`outlined`|`filled`|`standard`
}


export const SectionHeader = (props:TSectionHeader) => {
  const {
    id,
    sx,
    type,
    name,
    title,
    gutter,
    variant,
    actions,
    required,
    onChange,
    className,
    multiline,
    helperText,
    placeholder,
    onToggleEdit,
    initialEditing,
    label=type,
  } = props

  return (
    <Header
      sx={sx}
      gutter={gutter}
      className={cls('gr-section-header', className)}
    >

      <Input
        name={name}
        label={label}
        value={title}
        variant={variant}
        required={required}
        onChange={onChange}
        multiline={multiline}
        helperText={helperText}
        placeholder={placeholder}
        onToggleEdit={onToggleEdit}
        initialEditing={initialEditing}
        className='gr-section-header-title'
        id={`${type}-${id || name || title}`}
      />
      { actions && (
        <SectionActions actions={actions} type={type} />
      ) || null}
    </Header>
  )
  
}