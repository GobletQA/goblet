import type { ReactNode } from 'react'
import type { TSectionType } from '../../types'

import { Body } from './Section.styled'

export type TSectionBody = {
  type:TSectionType
  children?: ReactNode
}

export const SectionBody = (props:TSectionBody) => {
  const { children } = props
  
  return (
    <Body className='goblet-race-section-body' >
      {children}
    </Body>
  )
  
}