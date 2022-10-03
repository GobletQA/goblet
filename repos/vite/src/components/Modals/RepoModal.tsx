import type { ComponentProps } from 'react'
import { ModalRoot } from '@components/ModalManager/ModalRoot'
import { ModalTypes } from '@constants'

export type TRepoModal = ComponentProps<typeof ModalRoot>

export const RepoModal = (props:TRepoModal) => {
  return (
    <div>
      RepoModal
    </div>
  )
}

RepoModal.modalType = ModalTypes.repo
RepoModal.modalProps = {
  title: `Repo`,
  titleProps: {}
}