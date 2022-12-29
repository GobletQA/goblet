import type { ReactNode } from 'react'

import { Header } from './Section.styled'

export type TSectionHeader = {
  title?: string
  actions?: any[]
}

export const SectionHeader = (props:TSectionHeader) => {
  const {
    title,
    actions
  } = props
  
  
  return (
    <Header>
      {title}
    </Header>
  )
  
}