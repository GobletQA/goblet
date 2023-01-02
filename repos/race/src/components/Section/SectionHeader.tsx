import type { ESectionType, EEditKey } from '@GBR/types'
import type { ComponentType, CSSProperties } from 'react'
import type { TTextType } from '@gobletqa/components'



import { useMemo } from 'react'
import { Input } from '@gobletqa/components'

import Box from '@mui/material/Box'
import { capitalize, cls } from '@keg-hub/jsutils'
import { SectionActions } from './SectionActions'
import { Header, HeaderTitle } from './Section.styled'

export type TSectionHeader = {
  id?:string
  title:string
  label?:string
  gutter?:boolean
  name?:string
  className?:string
  sx?:CSSProperties
  type:ESectionType
  variant?:TTextType
  required?:boolean
  underline?:boolean
  multiline?:boolean
  helperText?:string
  placeholder?:string
  Icon?:ComponentType<any>
  editKey?:EEditKey|EEditKey[]
  actions?: Record<string, any>[]
}


export const SectionHeader = (props:TSectionHeader) => {
  const {
    id,
    sx,
    type,
    Icon,
    name,
    title,
    gutter,
    actions,
    variant,
    required,
    underline,
    className,
    multiline,
    helperText,
    placeholder,
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
        required={required}
        multiline={multiline}
        helperText={helperText}
        placeholder={placeholder}
        className='gr-section-header-title'
        id={`${type}-${id || name || title}`}
      >

        {Icon && (
          <Box className='gr-section-header-icon-wrap' >
            <Icon className='gr-section-header-icon' />
          </Box>
        ) || null }
      
        <HeaderTitle
          variant={variant || `h4`}
          sx={(underline && {
            paddingBottom: `5px`,
            borderBottom: `1px solid #ddd`
          }) as CSSProperties}
          className='gr-section-header-title'
        >
          {title}
        </HeaderTitle>

        { actions && (
          <SectionActions actions={actions} type={type} />
        ) || null}

      </Input>

    </Header>
  )
  
}