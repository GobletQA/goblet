import type { ComponentType } from 'react'
import type { TSectionType } from '../../types'

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
    title,
    actions
  } = props

  return (
    <Header>
      {Icon && (<Icon />) || null}
      {title && (
        <HeaderTitle className='goblet-race-section-header-title' >
          {title}
        </HeaderTitle>
      ) || null}
      { actions && (<SectionActions actions={actions} type={type} />) || null}
    </Header>
  )
  
}