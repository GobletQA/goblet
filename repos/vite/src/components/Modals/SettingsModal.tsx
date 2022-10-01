import type { ComponentProps } from 'react'
import { Modal } from './Modal'
import { ModalTypes } from '@constants'

export type TSettingsModal = ComponentProps<typeof Modal> & {
  
}

export const SettingsModal = (props:TSettingsModal) => {
  return (
    <div>
      SettingsModal
    </div>
  )
}

SettingsModal.modalType = ModalTypes.settings