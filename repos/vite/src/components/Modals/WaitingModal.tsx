import type { TModalComponent, TModalRef } from '@gobletqa/components'

import { useEffect } from 'react'
import { EModalTypes } from '@types'
import { ClockIcon } from '@gobletqa/components'
import { toggleModal } from '@actions/modals/toggleModal'
import { useContainerCreating } from '@hooks/api/useContainerCreating'
import { WaitOnContainer } from '@components/WaitOnContainer/WaitOnContainer'


export const WaitingModal:TModalRef = (props:TModalComponent) => {
  const showWaiting = useContainerCreating()

  useEffect(() => {
    !showWaiting && toggleModal(false)
  }, [showWaiting])

  return (<WaitOnContainer />)
}

WaitingModal.modalType = EModalTypes.Waiting
WaitingModal.modalProps = {
  Footer: false,
  manualClose: false,
  title: `Waiting for Session Container`,
  titleProps: {
    Icon: (<ClockIcon />)
  }
}