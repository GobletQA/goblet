import type { ComponentProps } from 'react'
import { useEffect, lazy, Suspense } from 'react'
import { Modal } from './Modal'
import { ModalTypes } from '@constants'
import Box from '@mui/material/Box'
import { Loading } from '@components/Loading'
const LazySignIn = lazy(() => import('@components/Admin/SignIn/SignIn'))

export type TSignInModal = ComponentProps<typeof Modal> & {
  
}

export const SignInModal = (props:TSignInModal) => {
  return (
    <Modal
      {...props}
      title={`Sign In`}
      manualClose={false}
    >
      <Box>
        <Suspense fallback={<Loading />} >
          <LazySignIn />
        </Suspense>
      </Box>
    </Modal>
  )
}

SignInModal.modalType = ModalTypes.signIn