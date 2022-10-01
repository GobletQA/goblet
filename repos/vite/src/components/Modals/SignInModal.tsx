import type { ComponentProps } from 'react'
import { Modal } from './Modal'
import { ModalTypes } from '@constants'

export type TSignInModal = ComponentProps<typeof Modal> & {
  
}

export const SignInModal = (props:TSignInModal) => {
  return (
    <div>
      SignInModal
    </div>
  )
}

SignInModal.modalType = ModalTypes.signIn