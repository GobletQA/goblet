import type { ReactNode } from 'react'
import {useCallback} from 'react'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
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
    children,
    Icon,
    text,
    auth,
    styles,
    onFail,
    provider,
    onSuccess,
    onSigningIn,
    prefix=defPrefix,
    classes=defClasses,
    ...btnProps
  } = props

  const iconProps = {} as any

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
    <Box
      style={styles?.main}
      className={`${prefix}-${classes?.main}`}
    >
      <Button
        {...btnProps}
        onClick={onBtnPress}
        className={`${prefix}-${classes?.button}`}
      >
        {Icon && (
          <Icon
            className={`${prefix}-${classes?.icon}`}
            {...iconProps}
          />
        )}
        {(children || text) && (
          <Typography
            style={styles?.text}
            className={`${prefix}-${classes?.text}`}
          >
            {children || text}
          </Typography>
        )}
      </Button>
    </Box>
  )
}
// (({ theme }) => ({
//   main: {
//     flD: 'column',
//     alI: 'center',
//     jtC: 'center',
//     mB: theme.margin.size,
//   },
//   button: {
//     default: {
//       main: {
//         maxW: 220,
//         flD: 'row',
//         alI: 'center',
//         jtC: 'center',
//         pH: theme.padding.size,
//         pV: (theme.padding.size / 3) * 2,
//         backgroundColor: '#333333',
//       },
//     },
//     hover: {
//       main: {
//         backgroundColor: '#555555',
//       },
//     },
//   },
//   icon: {
//     mR: 10,
//     fontSize: 20,
//     color: theme.colors.palette.white01,
//   },
//   text: {
//     fontSize: 14,
//     color: theme.colors.palette.white01,
//   },
// }))
