import type { TModalRef, TModalComponent } from '@types'
import { ModalTypes } from '@constants'


export const SettingsModal:TModalRef = (props:TModalComponent) => {
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