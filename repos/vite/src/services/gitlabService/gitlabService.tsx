import type { ReactNode } from 'react'
import type { User } from "oidc-react"

import { useEffect, createContext } from 'react'
import { Gitlab } from "@gitbeaker/browser"
import { useInline } from '@gobletqa/components'
import { hasCodeInUrl, AuthProvider, UserManager } from "oidc-react"

const GitlabClientId = process.env.GITLAB_CLIENT_ID || ``
const GitlabClientSecret = process.env.GITLAB_CLIENT_SECRET || ``
const GitlabUrl = process.env.GITLAB_AUTH_URL || `https://gitlab.com`

export type TGitlabAuth = {
  signIn?: boolean
  children:ReactNode
  onBeforeSignIn?:() => void
  onFail?:(error?:Error) => void
  onSignIn?:(user:User|null) => void
}

const GitlabManager = new UserManager({
  loadUserInfo: true,
  authority: GitlabUrl,
  response_type: `code`,
  client_id: GitlabClientId,
  automaticSilentRenew: true,
  client_secret: GitlabClientSecret,
  redirect_uri: window.location.href,
  scope: [
    `api`,
    `openid`,
    `email`,
  ].join(` `),
  metadata: {
    issuer: GitlabUrl,
    token_endpoint: GitlabUrl + "/oauth/token",
    jwks_uri: GitlabUrl + "/oauth/discovery/keys",
    userinfo_endpoint: GitlabUrl + "/oauth/userinfo",
    revocation_endpoint: GitlabUrl + "/oauth/revoke",
    authorization_endpoint: GitlabUrl + "/oauth/authorize",
    introspection_endpoint: GitlabUrl + "/oauth/introspect",
  },
})

const GitlabAuthContext = createContext<InstanceType<typeof Gitlab> | null>(null)

const GitlabChildren = (props:TGitlabAuth) => {
  const { children } = props

  useEffect(() => {
    /**
     * Checks if the auth code from gitlab is in the URL
     * This should only happen within the browser pop-up
     * And never on the original browser tab
     * If the code does exist, then we assume we are in the browser pop-up
     * Otherwise we are in the main window, so do nothing
     */
    if(!hasCodeInUrl(window.location)) return

    /**
     * If in the browser pop-up, and we have the code, then call the signinPopupCallback
     */
    ;(async () => {
      await GitlabManager.signinPopupCallback(window.location.href, false)
    })()
  }, [])

  return (<>{children}</>)
}

export const GitlabAuthProvider = (props:TGitlabAuth) => {
  const { signIn=false } = props
  const onSignInCB = useInline(props.onSignIn)

  return (
    <AuthProvider
      autoSignIn={signIn}
      onSignIn={onSignInCB}
      userManager={GitlabManager}
    >
      <GitlabChildren {...props} />
    </AuthProvider>
  )
}
