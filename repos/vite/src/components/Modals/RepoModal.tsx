import type { TModalRef, TModalComponent } from '@types'

import { ModalTypes } from '@constants'


export const RepoModal:TModalRef = (props:TModalComponent) => {
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