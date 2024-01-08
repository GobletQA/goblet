import type { TModalRef, TModalComponent } from '@gobletqa/components'

import { useApp } from "@store"
import { initStatus } from '@actions/init'
import {setStatus} from '@actions/app/setStatus'
import { EAppStatus, EModalTypes } from '@types'
import { connectModal } from '@actions/modals/modals'
import { getAppData } from '@utils/store/getStoreData'
import {toggleModal} from '@actions/modals/toggleModal'
import { ClockIcon, gutter } from '@gobletqa/components'
import { resetIdle } from '@actions/screencast/api/resetIdle'
import { restartContainer } from '@actions/container/api/restart'
import { signOutManually } from '@actions/admin/user/signOutManually'
import {
  ModalTitle,
  ModalSubText,
  ModalSubText2,
  ModalContainer
} from './Modal.styled'


export const IdleModal:TModalRef = (props:TModalComponent) => {
  const { status } = useApp()
  
  const messages = status === EAppStatus.Shutdown
    ? {
        title: `Session has expired.`,
        action: `Restart the session container?`,
        subtext: `The session container must be restarted before continuing.`,
      }
    : {
        action: `Would you like to continue?`,
        title: `Your session is about to expire.`,
        subtext: `All unsaved work will be permanently lost, without the possibility of recovery.`,
      }

  return (
    <ModalContainer>
      <ModalTitle>
        {messages.title}
      </ModalTitle>
      <ModalSubText>
        {messages.subtext}
      </ModalSubText>
      <ModalSubText2>
        {messages.action}
      </ModalSubText2>
    </ModalContainer>
  )
}

const onCloseModal = async () => {
  const { status } = getAppData()

  if(status === EAppStatus.Shutdown)
    return restartContainer({})

  toggleModal(false)
  await resetIdle()
  setTimeout(async () => await initStatus({ fromIdle: true }), 500)
  // Wait to update the status for 20 seconds, so the Idle modal doesn't reshow
  setTimeout(async () => setStatus(EAppStatus.Active), 15000)

}

IdleModal.modalType = EModalTypes.Idle
IdleModal.modalProps = {
  maxWidth: `xs`,
  title: `Are you still here?`,
  titleProps: {
    Icon: (<ClockIcon />)
  },
  headerSx: {
    margin: `0px`
  },
  actionProps: {
    sx: {
      justifyContent: `space-evenly`,
      paddingTop: gutter.padding.hpx,
      paddingBottom: gutter.padding.px,
      margin: `0px ${gutter.margin.px}`,
    }
  },
  onClose: onCloseModal,
  actions: [
    {
      text: `No`,
      color: `error`,
      variant:`outlined`,
      onClick: () => signOutManually(),
    },
    {
      text: `Yes`,
      color: `success`,
      keyboard: `enter`,
      variant:`contained`,
      onClick: onCloseModal,
    },
  ],
}