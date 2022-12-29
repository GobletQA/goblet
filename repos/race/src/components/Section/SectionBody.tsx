import type { ReactNode } from 'react'

import { Body } from './Section.styled'

export type TSectionBody = {
  children?: ReactNode
}

export const SectionBody = (props:TSectionBody) => {
  const { children } = props
  
  return (
    <Body>
      {children}
    </Body>
  )
  
}