import type { CSSProperties, ComponentType } from 'react'

import { useEffect, useState, useCallback } from 'react'
import { EAuthType } from '@types'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import { Container } from './SignIn.style'
import { GithubIcon, GitlabIcon } from '@gobletqa/components'
import { OtherProviders } from '../OtherProviders'
import { loadUser } from '@actions/admin/user/loadUser'
import { getProviderMetadata } from '@services/providers'
import { GithubSignIn } from '../GithubSignIn/GithubSignIn'
import { GitlabSignIn } from '../GitlabSignIn/GitlabSignIn'
import { onSuccessAuth, onFailedAuth } from '@actions/admin/provider'
import { checkCall, isArr, noOp, capitalize } from '@keg-hub/jsutils'


const { auth, config } = getProviderMetadata()

export type TSignIn = {
  messageSx?: CSSProperties
  MessageComponent?: ComponentType<any>
  onNoAuthConfig?: (...args:any) => any
}

/**
 * Remove the signInSuccessUrl property to allow sign in to be handled by the callbacks
 */
const authConfig = config && config.ui

const SignIn = (props:TSignIn) => {

  const { onNoAuthConfig=noOp, MessageComponent, messageSx } = props

  useEffect(() => {
    !authConfig ? checkCall(onNoAuthConfig) : loadUser()
  })

  const [signingIn, setSigningIn] = useState<boolean>(false)
  const [signInError, setSignInError] = useState<string|undefined>()

  const onFailedSignIn = useCallback((err?:Error, type?:EAuthType) => {
    setSigningIn(false)

    const message = err?.message
      || `[Auth State Error] ${type ? capitalize(type) : ''} Authentication failed.`

    setSignInError(message)
    onFailedAuth(err, message)
  }, [])

  return !authConfig || !isArr(authConfig?.signInOptions)
    ? null
    : (
      <Container>
        <List>
          {/* TODO: update this when more providers are added */}
          {authConfig.signInOptions.map((option:any) => 
            <GithubSignIn
              auth={auth}
              Icon={GithubIcon}
              provider={option}
              disabled={signingIn}
              onFail={onFailedSignIn}
              key={option.providerId}
              onSigningIn={setSigningIn}
              onSuccess={onSuccessAuth}
              children='Sign in with Github'
            />
          )}
          {
            <GitlabSignIn
              Icon={GitlabIcon}
              disabled={signingIn}
              onFail={onFailedSignIn}
              onSuccess={onSuccessAuth}
              onSigningIn={setSigningIn}
              children='Sign in with Gitlab'
            />
          }
          <OtherProviders />
        </List>
        <Box>
          {MessageComponent && (
            <MessageComponent
              sx={messageSx}
              error={signInError}
              loading={signingIn && 'Signing in ...'}
            />
          )}
        </Box>
      </Container>
    )
}

export default SignIn