import type { ComponentType } from 'react'
import type { TSectionType } from '../../types'

import { useMemo } from 'react'
import Box from '@mui/material/Box'
import { capitalize } from '@keg-hub/jsutils'
import { SectionActions } from './SectionActions'
import { Header, HeaderTitle } from './Section.styled'

export type TSectionHeader = {
  title?:string
  type:TSectionType
  Icon?: ComponentType<any>
  actions?: Record<string, any>[]
}


export const SectionHeader = (props:TSectionHeader) => {
  const {
    type,
    Icon,
    actions
  } = props

  const title = useMemo(() => {
    const title = props?.title?.trim()
    return title && capitalize(title)
  }, [props.title])

  return (
    <Header>
      <Box className='gr-section-header-icon-wrap' >
      {Icon && (<Icon className='gr-section-header-icon' />) || null}
      </Box>
      {title && (
        <HeaderTitle className='gr-section-header-title' >
          {title}
        </HeaderTitle>
      ) || null}
      { actions && (<SectionActions actions={actions} type={type} />) || null}
    </Header>
  )
  
}