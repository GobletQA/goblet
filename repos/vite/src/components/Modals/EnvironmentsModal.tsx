import type { TModalRef, TModalComponent } from '@types'

import { EModalTypes } from '@types'
import { Environments } from '@components/Environments'
import { SettingsEthernetIcon } from '@components/Icons'


export const EnvironmentsModal:TModalRef = (props:TModalComponent) => {
  return (<Environments />)
}

EnvironmentsModal.modalType = EModalTypes.Environments
EnvironmentsModal.modalProps = {
  maxWidth: `xs`,
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