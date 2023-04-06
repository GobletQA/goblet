import type { User } from "oidc-react"
import type { TRawAuthUser } from '@types'
import type { ReactNode, CSSProperties, Dispatch, SetStateAction } from 'react'

import { useCallback } from 'react'
import { EAuthType } from '@types'
import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import { useInline } from '@gobletqa/components'
import { useAuth } from "oidc-react"
import { colors } from '@gobletqa/components/theme'
import { GitLabAuthProvider } from '@services/gitlabService/gitlabService'


export type TGitlabSignIn = {
  Icon?: any,
  text?: ReactNode,
  disabled?:boolean
  sx?:CSSProperties
  children?: ReactNode,
  onSigningIn?: Dispatch<SetStateAction<boolean>>,
  onFail?: (error?:Error, type?:EAuthType) => void,
  onSuccess?: (rawUser:TRawAuthUser, type:EAuthType) => void,
}

const GitlabSignInButton = (props:TGitlabSignIn) => {

  const {
    sx,
    Icon,
    text,
    onFail,
    children,
    disabled,
    onSuccess,
    onSigningIn,
  } = props

  const auth = useAuth()

  const onBtnPress = useCallback(async (evt:any) => {
    const opener = window.opener
    if(!opener) window.opener = window
    onSigningIn?.(true)
    await auth.signInPopup()
    window.opener = opener
  }, [auth, onFail, onSuccess, onSigningIn])

  return (
    <ListItem
      sx={{ minWidth: 120 }}
      className='gb-gitlab-main gb-gitlab-list-item'
    >
        <Button
          disabled={disabled}
          variant="contained"
          onClick={onBtnPress}
          className='gb-gitlab-button'
          startIcon={Icon && (<Icon className='gb-gitlab-icon' />)}
          sx={[{
            width: `100%`,
            color: colors.white,
            // Gitlab purple, only place it's used
            backgroundColor: `#292961`,
          }, sx] as CSSProperties[]}
        >
          {children || text}
        </Button>
    </ListItem>
  )
  
}

export const GitlabSignIn = (props:TGitlabSignIn) => {
 
   const {
    onFail,
    onSuccess,
    onSigningIn,
  } = props
 
  const onSignIn = useInline((user:TRawAuthUser|null) => {
    onSigningIn?.(false)
    user
      ? onSuccess?.(user, EAuthType.gitlab)
      : onFail?.(new Error(`Could not authenticate with Gitlab provider`), EAuthType.gitlab)
  })

  return (
    <GitLabAuthProvider
      onFail={onFail}
      onSignIn={onSignIn}
    >
      <GitlabSignInButton {...props} />
    </GitLabAuthProvider>
  )
}