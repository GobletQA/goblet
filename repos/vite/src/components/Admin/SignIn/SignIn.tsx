import React, { useEffect, useState, useCallback } from 'react'
import { ReMessage } from './SignIn.style'
import { OtherProviders } from '../OtherProviders'
import { checkCall, isArr } from '@keg-hub/jsutils'
import { GitHubIcon } from '@components/Icons'
import { loadUser } from '@actions/admin/user/loadUser'
import { getProviderMetadata } from '@services/providers'
import { SignInButton } from '../GithubSignIn/SignInButton'
import { onSuccessAuth, onFailedAuth } from '@actions/admin/provider'

const { auth, config } = getProviderMetadata()

export type TSignIn = {
  [key:string]: any
}

/**
 * Remove the signInSuccessUrl property to allow sign in to be handled by the callbacks
 */
const authConfig = config && config.ui

const SignIn = (props:TSignIn) => {

  const {authDisabled, onNoAuthConfig, MessageComponent} = props

  useEffect(() => {
    authDisabled || !authConfig ? checkCall(onNoAuthConfig) : loadUser()
  })

  const [signingIn, setSigningIn] = useState(false)
  const [signInError, setSignInError] = useState()

  const onFailedSignIn = useCallback((err:any) => {
    setSigningIn(false)
    setSignInError(err.message)
    onFailedAuth(err)
  }, [])

  // Only show the auth buttons when they are enabled
  // In local mode auth is disabled, so no need to show them
  return authDisabled || !authConfig || !isArr(authConfig?.signInOptions)
    ? null
    : (
      <>
        <ReMessage>
          {MessageComponent && (
            <MessageComponent
              error={signInError}
              loading={signingIn && 'Signing in ...'}
            />
          )}
        </ReMessage>
        {/* TODO: update this when more providers are added */}
        {authConfig.signInOptions.map((option:any) => 
          <SignInButton
            auth={auth}
            Icon={GitHubIcon}
            provider={option}
            prefix='keg-github'
            disabled={signingIn}
            onFail={onFailedSignIn}
            onSigningIn={setSigningIn}
            onSuccess={onSuccessAuth}
            key={option.providerId}
            children='Sign in with GitHub'
          />
        )}
        <OtherProviders />
      </>
    )
}

export default SignIn