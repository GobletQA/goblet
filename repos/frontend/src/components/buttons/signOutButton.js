import React from 'react'

import { GobletButton } from './button.restyle'
import { SignOut } from 'HKAssets/icons/signOut'
import { useDisconnectRepo } from 'HKHooks/repo/useDisconnectRepo'
import { signOutAuthUser } from 'HKActions/admin/provider/signOutAuthUser'

/**
 * SignOutButton - Component to log a signed in user out
 * @param {Object} props
 *
 */
export const SignOutButton = props => {
  const { children, text = 'SignOut', ...args } = props

  const onClick = useDisconnectRepo(signOutAuthUser)

  return (
    <GobletButton
      type='danger'
      Icon={SignOut}
      classPrefix='sign-out'
      {...args}
      onClick={onClick}
    >
      {children || text}
    </GobletButton>
  )
}
