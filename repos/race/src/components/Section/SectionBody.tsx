import type { TEditingProps } from '@GBR/types'
import type { ESectionType } from '../../types'
import type { ReactNode, CSSProperties } from 'react'

import { Body } from './Section.styled'

export type TSectionBody = TEditingProps & {
  type:ESectionType
  gutter?:boolean
  sx?:CSSProperties
  children?: ReactNode
}

export const SectionBody = (props:TSectionBody) => {
  const {
    sx,
    gutter,
    children,
    editing,
    setEditing,
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