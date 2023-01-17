import type { CSSProperties } from 'react'

import { SubNavId } from '@constants'
import { SubNavContent, SubNavContainer } from './Nav.styled'

export type TSubNavProps = {
  open?: boolean
  locked?:boolean
  sx?:CSSProperties
  activeNav?: string | undefined
  setLocked?:(lock:boolean) => void
}

export type TSubNavLock = {
  locked?:boolean
  setLocked?:(lock:boolean) => void
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