import type { TModalRef, TModalComponent } from '@gobletqa/components'

import { EModalTypes } from '@types'
import { Settings } from '@components/Settings'
import { Settings as SettingsIcn } from '@gobletqa/components'

export const SettingsModal:TModalRef = (props:TModalComponent) => {
  return (
    <Settings />
  )
}

SettingsModal.modalType = EModalTypes.settings
SettingsModal.modalProps = {
  maxWidth: `lg`,
  title: `Settings`,
  titleProps: {
    Icon: (<SettingsIcn />)
  },
}