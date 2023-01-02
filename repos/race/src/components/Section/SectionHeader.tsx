import type { ESectionType } from '../../types'
import type { ComponentType, CSSProperties } from 'react'
import type { TTextType } from '@gobletqa/components'

import { useMemo } from 'react'
import Box from '@mui/material/Box'
import { capitalize, cls } from '@keg-hub/jsutils'
import { SectionActions } from './SectionActions'
import { Header, HeaderTitle } from './Section.styled'

export type TSectionHeader = {
  title?:string
  gutter?:boolean
  className?:string
  sx?:CSSProperties
  type:ESectionType
  variant?:TTextType
  underline?:boolean
  Icon?: ComponentType<any>
  actions?: Record<string, any>[]
}


export const SectionHeader = (props:TSectionHeader) => {
  const {
    sx,
    type,
    Icon,
    gutter,
    actions,
    variant,
    underline,
    className,
  } = props

  const title = useMemo(() => {
    const title = props?.title?.trim()
    return title && capitalize(title)
  }, [props.title])

  return (
    <Header
      sx={sx}
      gutter={gutter}
      className={cls('gr-section-header', className)}
    >

      {Icon && (
        <Box className='gr-section-header-icon-wrap' >
          <Icon className='gr-section-header-icon' />
        </Box>
      ) || null }

      {title && (
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
      ) || null}

      { actions && (
        <SectionActions actions={actions} type={type} />
      ) || null}

    </Header>
  )
  
}