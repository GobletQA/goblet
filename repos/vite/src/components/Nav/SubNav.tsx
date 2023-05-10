import type { CSSProperties } from 'react'

import { SubNavId } from '@constants'
import { SubNavContent, SubNavContainer } from './Nav.styled'

export type TSubNavProps = {
  sx?:CSSProperties
}

export const SubNav = (props:TSubNavProps) => {
  return (
    <SubNavContainer
      sx={props.sx}
      className='gb-nav-subnav'
    >
      <SubNavContent
        id={SubNavId}
        className='gb-nav-subnav-content'
      />
    </SubNavContainer>
  )
}