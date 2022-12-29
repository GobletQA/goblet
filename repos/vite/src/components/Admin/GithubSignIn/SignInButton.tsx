import type { ReactNode } from 'react'

import { useCallback } from 'react'
import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import { colors } from '@gobletqa/components/theme'
import { signInWithPopup, GithubAuthProvider } from 'firebase/auth'

const defPrefix = 'goblet-github-button'
const defClasses = {
  main: 'main',
  button: 'button',
  content: 'content',
  text: 'text',
  icon: 'icon',
}

export type TSignInButton = {
    Icon?: any,
    text?: ReactNode,
    children?: ReactNode,
    auth: any,
    styles?: any,
    provider?:any,
    prefix?:string
    disabled?:boolean
    classes?:Record<string, string>
    onFail?: (...args:any[]) => void,
    onSuccess?: (...args:any[]) => void,
    onSigningIn: (...args:any[]) => void,
}

export const SignInButton = (props:TSignInButton) => {
  const {
    Icon,
    text,
    auth,
    onFail,
    provider,
    children,
    onSuccess,
    onSigningIn,
    prefix=defPrefix,
    classes=defClasses,
    ...btnProps
  } = props

  const onBtnPress = useCallback(async (evt:any) => {
    onSigningIn?.(true)

    signInWithPopup(auth, provider)
      .then((result:any) => {
        const credential = GithubAuthProvider.credentialFromResult(result)
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
        })
      })
      .catch(err => onFail?.(err))

  }, [auth, provider, onSuccess, onFail])

  return (
    <ListItem
      sx={{ minWidth: 120 }}
      className={`${prefix}-${classes?.main}`}
    >
      <Button
        variant="contained"
        startIcon={Icon && (<Icon className={`${prefix}-${classes?.icon}`} />)}
        {...btnProps}
        onClick={onBtnPress}
        className={`${prefix}-${classes?.button}`}
        sx={{
          width: `100%`,
          color: colors.white,
          backgroundColor: colors.black09,
        }}
      >
        {children || text}
      </Button>
    </ListItem>
  )
}