
import { SubNavId } from '@constants'
import { SubNavContent, SubNavContainer } from './Nav.styled'

export type TSubNavProps = {
  open?: boolean
  locked?:boolean
  activeNav?: string | undefined
  setLocked?:(lock:boolean) => void
}

export type TSubNavLock = {
  locked?:boolean
  setLocked?:(lock:boolean) => void
}


export const SubNav = (props:TSubNavProps) => {

  return (
    <SubNavContainer className='gb-nav-subnav'>
      <SubNavContent
        id={SubNavId}
        className='gb-nav-subnav-content'
      />
    </SubNavContainer>
  )
}