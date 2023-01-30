import type { ESectionType } from '../../types'
import type { ReactNode, CSSProperties } from 'react'

import { Body } from './Section.styled'

export type TSectionBody = {
  gutter?:boolean
  type:ESectionType
  children?: ReactNode
  sx?:CSSProperties|CSSProperties[]
}

export const SectionBody = (props:TSectionBody) => {
  const {
    sx,
    gutter,
    children,
  } = props
  
  return (
    <Body
      sx={sx}
      gutter={gutter}
      className='gr-section-body'
    >
      {children}
    </Body>
  )
  
}