import type { ComponentProps } from 'react'
import { Modal } from './Modal'
import { ModalTypes } from '@constants'


export type TConnectModal = ComponentProps<typeof Modal> & {
  
}

export const ConnectModal = (props:TConnectModal) => {
  return (
    <div>
      ConnectModal
    </div>
  )
}

ConnectModal.modalType = ModalTypes.connect