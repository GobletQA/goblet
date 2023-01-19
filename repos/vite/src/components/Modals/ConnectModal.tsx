import type { TModalFooter, TModalComponent, TModalRef } from '@types'

import { useMemo } from 'react'
import { useContainer } from '@store'
import Divider from '@mui/material/Divider'
import { PlugIcon } from '@gobletqa/components'
import { gutter } from '@gobletqa/components/theme'
import { EModalTypes, EContainerState } from '@types'
import { ConnectForm } from '@components/Forms/ConnectForm'
import { ModalFooter } from '@components/ModalManager/ModalFooter'
import { WaitOnContainer } from '@components/WaitOnContainer/WaitOnContainer'

export const ConnectModal:TModalRef = (props:TModalComponent) => {
  const { ModalMessage } = props
  const container = useContainer()

  const showWaiting = useMemo(() => {
    return !container?.meta?.state || container?.meta?.state === EContainerState.Creating
  }, [container?.meta?.state])

  return showWaiting
    ? (<WaitOnContainer />)
    : (
        <ConnectForm
          FormMessage={ModalMessage}
          Footer={(footerProps:TModalFooter) => (
            <>
              <Divider />
              <ModalFooter
                {...footerProps}
                sx={{
                  justifyContent: `space-between`,
                  padding: `${gutter.padding.px} 0px 0px`,
                }}
              />
            </>
          )}
        />
      )
}

ConnectModal.modalType = EModalTypes.connect
ConnectModal.modalProps = {
  Footer: false,
  manualClose: false,
  title: `Connect Repo`,
  titleProps: {
    Icon: (<PlugIcon />)
  }
}