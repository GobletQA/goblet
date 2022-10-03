import type { ComponentProps } from 'react'
import { ModalRoot } from '@components/ModalManager/ModalRoot'

import { ModalTypes } from '@constants'

export type TSettingsModal = ComponentProps<typeof ModalRoot>

export const SettingsModal = (props:TSettingsModal) => {
  return (
    <div>
      SettingsModal
    </div>
  )
}

SettingsModal.modalType = ModalTypes.settings
SettingsModal.modalProps = {
  title: `Settings`,
  titleProps: {}
}