import type { ReactNode, Dispatch, SetStateAction } from 'react'
import type { TRawAuthUser } from '@types'

import { EAuthType } from '@types'
import { useCallback } from 'react'
import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import { colors } from '@gobletqa/components/theme'
import { signInWithPopup, GithubAuthProvider } from 'firebase/auth'


export type TSignInButton = {
    auth: any,
    Icon?: any,
    styles?: any,
    provider?:any,
    text?: ReactNode,
    disabled?:boolean
    children?: ReactNode,
    onSigningIn?: Dispatch<SetStateAction<boolean>>,
    onFail?: (error?:Error, type?:EAuthType) => void,
    onSuccess?: (rawUser:TRawAuthUser, type:EAuthType) => void,
}

export const GithubSignIn = (props:TSignInButton) => {
  const {
    Icon,
    text,
    auth,
    onFail,
    provider,
    children,
    onSuccess,
    onSigningIn,
    ...btnProps
  } = props

  const onBtnPress = useCallback(async (evt:any) => {
    onSigningIn?.(true)

    signInWithPopup(auth, provider)
      .then((result:any) => {
        const credential = GithubAuthProvider.credentialFromResult(result)
        if(!credential) throw new Error(`Could not parse GitHub credential from response`)

        const user = result.user
        const additionalUserInfo = result._tokenResponse
        try {
          additionalUserInfo.profile = JSON.parse(additionalUserInfo.rawUserInfo)
        }
        catch(err:any){
          console.error(err.message)
          throw new Error(`Could not parse GitHub User profile information`)
        }
        onSuccess?.({
          user,
          credential,
          additionalUserInfo
        }, EAuthType.github)
      })
      .catch(err => onFail?.(err, EAuthType.github))

  }, [auth, provider, onSuccess, onFail])

  return (
    <ListItem
      sx={{ minWidth: 120 }}
      className='gb-github-main gb-github-list-item'
    >
      <Button
        variant="contained"
        startIcon={Icon && (<Icon className='gb-github-icon' />)}
        {...btnProps}
        onClick={onBtnPress}
        className='gb-github-button'
        sx={{
          width: `100%`,
          color: colors.white,
          // Github Black, only place it's used
          backgroundColor: `#161b22`,
        }}
      >
        {children || text}
      </Button>
    </ListItem>
  )
}