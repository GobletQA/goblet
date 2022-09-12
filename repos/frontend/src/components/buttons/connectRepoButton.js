import React, { useCallback, useMemo } from 'react'
import { Values } from 'GBConstants'
import { Exchange } from 'GBAssets/icons/exchange'
import { GobletButton } from './button.restyle'
import { useSelector } from 'GBHooks/useSelector'
import { checkCall, isEmptyColl } from '@keg-hub/jsutils'
import { connectRepo } from 'GBActions/repo/api/connect'

const { STORAGE, CATEGORIES, CONTAINER } = Values

export const ConnectRepoButton = props => {
  const {
    styles,
    branch,
    repoUrl,
    onError,
    children,
    disabled,
    newBranch,
    onConnecting,
    createBranch,
    onConnect: onConnectCb,
  } = props

  const { user, repo, routes } = useSelector(STORAGE.USER, STORAGE.REPO, CATEGORIES.ROUTES)

  const disabledBtn = useMemo(
    // If repo is not empty, then force disable the button
    // Or the session container in not ready
    () => (
      !isEmptyColl(repo) || routes?.meta?.state !== CONTAINER.STATE.RUNNING
        ? true
        : disabled
    ),
    [repo, disabled, routes]
  )

  const onConnect = useCallback(async () => {
    // TODO: add repoUrl validation
    if (!branch || !repoUrl)
      return checkCall(
        onError,
        new Error(`Missing repo branch or url`),
        branch,
        repoUrl
      )

    checkCall(onConnecting, true)
    // TODO: update the action to pull the user instead of doing it here
    const resp = await connectRepo({
      branch,
      repoUrl,
      newBranch,
      createBranch,
      username: user.username,
    })

    checkCall(onConnecting, false)

    return resp
      ? checkCall(onConnectCb, resp)
      : checkCall(
          onError,
          new Error(`Failed to mount repo. Please try again later`),
          resp
        )
  }, [
    user,
    branch,
    repoUrl,
    onError,
    newBranch,
    onConnectCb,
    onConnecting,
    createBranch,
  ])


  return (
    <GobletButton
      Icon={Exchange}
      type='primary'
      onClick={onConnect}
      classPrefix='connect'
      disabled={disabledBtn}
      styles={styles?.button}
      text={children || `Connect`}
    />
  )
}
