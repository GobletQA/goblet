import { useEffect, useState, useCallback } from 'react'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import { GitHubIcon } from '@components/Icons'
import { OtherProviders } from '../OtherProviders'
import { checkCall, isArr, noOp } from '@keg-hub/jsutils'
import { loadUser } from '@actions/admin/user/loadUser'
import { getProviderMetadata } from '@services/providers'
import { SignInButton } from '../GithubSignIn/SignInButton'
import { onSuccessAuth, onFailedAuth } from '@actions/admin/provider'

const { auth, config } = getProviderMetadata()

export type TSignIn = {
  MessageComponent?: any
  onNoAuthConfig?: (...args:any) => any
}

/**
 * Remove the signInSuccessUrl property to allow sign in to be handled by the callbacks
 */
const authConfig = config && config.ui

const SignIn = (props:TSignIn) => {

  const {onNoAuthConfig=noOp, MessageComponent} = props

  useEffect(() => {
    !authConfig ? checkCall(onNoAuthConfig) : loadUser()
  })

  const [signingIn, setSigningIn] = useState(false)
  const [signInError, setSignInError] = useState()

  const onFailedSignIn = useCallback((err:any) => {
    setSigningIn(false)
    setSignInError(err.message)
    onFailedAuth(err)
  }, [])

  return !authConfig || !isArr(authConfig?.signInOptions)
    ? null
    : (
      <Box
        display="flex"
        alignItems="center"
        alignContent="center"
        flexDirection="column"
        justifyContent="center"
      >
        <Box
        >
          {MessageComponent && (
            <MessageComponent
              error={signInError}
              loading={signingIn && 'Signing in ...'}
            />
          )}
        </Box>
        <List>
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
        </List>
      </Box>
    )
}

export default SignIn