import type { ComponentProps } from 'react'
import { Modal } from './Modal'
import { ModalTypes } from '@constants'

export type TRepoModal = ComponentProps<typeof Modal> & {
  
}

export const RepoModal = (props:TRepoModal) => {
  return (
    <div>
      RepoModal
    </div>
  )
}

RepoModal.modalType = ModalTypes.repo