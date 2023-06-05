import type { TModalRef, TModalComponent } from '@gobletqa/components'

import { EModalTypes } from '@types'
import { ClockIcon } from '@gobletqa/components'
import { Environments } from '@components/Environments'


export const IdleModal:TModalRef = (props:TModalComponent) => {
  return (
    <>
      show idle
    </>
  )
}

IdleModal.modalType = EModalTypes.Idle
IdleModal.modalProps = {
  title: `Are you still here?`,
  titleProps: {
    Icon: (<ClockIcon />)
  },
  actionProps: {
    sx: {
      paddingTop: `10px`,
      paddingBottom: `20px`,
      justifyContent: `space-around`
    }
  },
}