
import { SubNavId } from '@constants'
import { SubNavContent, SubNavContainer } from './Nav.styled'

export type TSubNavProps = {
  open?: boolean
  activeNav?: string | undefined
}

export const SubNav = (props:TSubNavProps) => {

  return (
    <SubNavContainer className='gb-nav-subnav'>
      <SubNavContent id={SubNavId} className='gb-nav-subnav-content' />
    </SubNavContainer>
  )
}