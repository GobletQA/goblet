import type { TModalRef, TModalComponent } from '@types'

import { ModalTypes } from '@constants'
import { Settings } from '@components/Settings'
import { Settings as SettingsIcn } from '@components/Icons'

export const SettingsModal:TModalRef = (props:TModalComponent) => {
  return (
    <Settings />
  )
}

SettingsModal.modalType = ModalTypes.settings
SettingsModal.modalProps = {
  maxWidth: `lg`,
  title: `Settings`,
  titleProps: {
    Icon: (<SettingsIcn />)
  },
}