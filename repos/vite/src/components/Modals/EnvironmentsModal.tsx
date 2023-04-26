import type { TModalRef, TModalComponent } from '@gobletqa/components'

import { EModalTypes } from '@types'
import { Environments } from '@components/Environments'
import { SettingsEthernetIcon } from '@gobletqa/components'


export const EnvironmentsModal:TModalRef = (props:TModalComponent) => {
  return (<Environments />)
}

EnvironmentsModal.modalType = EModalTypes.Environments
EnvironmentsModal.modalProps = {
  title: `Environments`,
  titleProps: {
    Icon: (<SettingsEthernetIcon />)
  },
  actionProps: {
    sx: {
      paddingTop: `10px`,
      paddingBottom: `20px`,
      justifyContent: `space-around`
    }
  },
}