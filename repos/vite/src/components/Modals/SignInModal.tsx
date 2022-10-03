import type { ComponentProps } from 'react'
import { ModalRoot } from '@components/ModalManager/ModalRoot'

import { lazy, Suspense } from 'react'
import { ModalTypes } from '@constants'
import { Git } from '@components/Icons/Git'
import { Loading } from '@components/Loading'

const LazySignIn = lazy(() => import('@components/Admin/SignIn/SignIn'))

export type TSignInModal = ComponentProps<typeof ModalRoot>

export const SignInModal = (props:TSignInModal) => {
  return (
    <Suspense fallback={<Loading />} >
      <LazySignIn />
    </Suspense>
  )
}

SignInModal.modalType = ModalTypes.signIn
SignInModal.modalProps = {
  maxWidth: `sm`,
  title: `Sign In`,
  manualClose: false,
  titleProps: {
    Icon: (<Git />)
  }
}