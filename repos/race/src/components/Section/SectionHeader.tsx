import type { ESectionType, EEditKey } from '@GBR/types'
import type { ComponentType, CSSProperties } from 'react'
import type { TTextType } from '@gobletqa/components'

import { useMemo } from 'react'
import { useIsEditing } from '@GBR/hooks'
import { useEditing } from '@GBR/contexts'
import { TextEdit } from '../Form/TextEdit'

import Box from '@mui/material/Box'
import { capitalize, cls } from '@keg-hub/jsutils'
import { SectionActions } from './SectionActions'
import { Header, HeaderTitle } from './Section.styled'

export type TSectionHeader = {
  title:string
  gutter?:boolean
  className?:string
  sx?:CSSProperties
  type:ESectionType
  variant?:TTextType
  isError?:boolean
  underline?:boolean
  multiline?:boolean
  helperText?:string
  placeholder?:string
  Icon?:ComponentType<any>
  editKey:EEditKey|EEditKey[]
  actions?: Record<string, any>[]
}


export const SectionHeader = (props:TSectionHeader) => {
  const {
    sx,
    type,
    Icon,
    gutter,
    editKey,
    actions,
    isError,
    variant,
    underline,
    className,
    multiline,
    helperText,
    placeholder
  } = props

  const title = useMemo(() => {
    const title = props?.title?.trim()
    return title && capitalize(title)
  }, [props.title])
  
  const isEditing = useIsEditing(editKey)

  return (
    <Header
      sx={sx}
      gutter={gutter}
      className={cls('gr-section-header', className)}
    >

      <TextEdit
        label={type}
        text={title}
        editKey={editKey}
        isError={isError}
        isEditing={isEditing}
        multiline={multiline}
        helperText={helperText}
        id={`${type}-${editKey}`}
        placeholder={placeholder}
        className='gr-section-header-title'
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

      </TextEdit>

    </Header>
  )
  
}