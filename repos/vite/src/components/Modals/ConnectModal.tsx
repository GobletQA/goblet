import type { TModalComponent, TModalRef } from '@types'

import { useMemo } from 'react'
import { gutter } from '@theme'
import { useContainer } from '@store'
import { ModalTypes } from '@constants'
import { EContainerState } from '@types'
import Divider from '@mui/material/Divider'
import { PlugIcon } from '@components/Icons'
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
          FormActions={(props:any) => {
            return (
              <>
                <Divider />
                <ModalFooter
                  {...props}
                  sx={{
                    padding: `${gutter.padding.px} ${gutter.padding.dpx}`,
                    justifyContent: `space-between`,
                  }}
                />
              </>
            )
          }}
        />
      )
}

ConnectModal.modalType = ModalTypes.connect
ConnectModal.modalProps = {
  Footer: false,
  manualClose: false,
  title: `Connect Repo`,
  titleProps: {
    Icon: (<PlugIcon />)
  }
}