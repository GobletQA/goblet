import { Text } from '@gobletqa/components'
import { SubNavContainer } from './Nav.styled'

export type TSubNavProps = {
  open?: boolean
  activeNav?: string | undefined
}

const SubNavContent = (props:TSubNavProps) => {
  const {
    activeNav
  } = props

  return (
    <Text component="p" >
      {activeNav} - sub-nav
    </Text>
  )
}

export const SubNav = (props:TSubNavProps) => {
  return (
    <SubNavContainer className='gb-nav-sub-nav'>
      <SubNavContent {...props} />
    </SubNavContainer>
  )
}