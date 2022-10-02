import type { ComponentProps } from 'react'

import { lazy, Suspense } from 'react'
import { Modal } from './Modal'
import Box from '@mui/material/Box'
import { ModalTypes } from '@constants'
import { Git } from '@components/Icons/Git'
import { Loading } from '@components/Loading'
const LazySignIn = lazy(() => import('@components/Admin/SignIn/SignIn'))

export type TSignInModal = ComponentProps<typeof Modal> & {
  
}

export const SignInModal = (props:TSignInModal) => {
  return (
    <Modal
      {...props}
      maxWidth="sm"
      title={`Sign In`}
      manualClose={false}
      titleProps={{
        Icon: (<Git />)
      }}
    >
      <Suspense fallback={<Loading />} >
        <LazySignIn />
      </Suspense>
    </Modal>
  )
}

SignInModal.modalType = ModalTypes.signIn