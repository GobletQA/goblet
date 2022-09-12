import React, { useCallback, useMemo } from 'react'

import { Values } from 'GBConstants'
import { Times } from 'GBAssets/icons/times'
import { GobletButton } from './button.restyle'
import { useSelector } from 'GBHooks/useSelector'
import { isEmptyColl, checkCall } from '@keg-hub/jsutils'
import { useDisconnectRepo } from 'GBHooks/repo/useDisconnectRepo'
import { signOutAuthUser } from 'GBActions/admin/provider/signOutAuthUser'

const { STORAGE } = Values

export const DisconnectRepoButton = props => {
  const {
    text,
    styles,
    children,
    disabled,
    signOutUser,
    onClick: onClickCb,
  } = props

  const { user } = useSelector(STORAGE.USER)
  const { repo } = useSelector(STORAGE.REPO)

  const disableBtn = useMemo(
    // If repo is empty or no user, then force disable the button
    () => (isEmptyColl(repo) || !user ? true : disabled),
    [repo, user, disabled]
  )

  const onDisconnect = useCallback(
    evt => {
      signOutUser && signOutAuthUser()
      checkCall(onClickCb, evt)
    },
    [onClickCb, signOutUser]
  )

  const onClick = useDisconnectRepo(onDisconnect)

  return (
    <GobletButton
      Icon={Times}
      type='danger'
      styles={styles}
      onClick={onClick}
      disabled={disableBtn}
      classPrefix='disconnect'
      text={children || text || `Disconnect`}
    />
  )
}
