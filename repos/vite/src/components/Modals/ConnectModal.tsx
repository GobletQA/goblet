import type { ComponentProps } from 'react'

import Box from '@mui/material/Box'
import { useConnectForm } from '@hooks'
import { ModalTypes } from '@constants'
import { FormGen } from '@components/Form'
import { ConnectIcon } from '@components/Icons'

import { ModalRoot } from '@components/ModalManager/ModalRoot'
export type TConnectModal = ComponentProps<typeof ModalRoot>

export const ConnectModal = (props:TConnectModal) => {
  const { ModalMessage } = props

  const {
    config,
    loading,
    isConnecting,
    connectError
  } = useConnectForm()

  return (
    <Box>
      <ModalMessage
        error={connectError}
        loading={isConnecting && 'Connecting Repo ...'}
      />
      <FormGen
        config={config}
        loading={loading}
      />
    </Box>
  )
}

ConnectModal.modalType = ModalTypes.connect
ConnectModal.modalProps = {
  title: `Connect Repo`,
  manualClose: false,
  titleProps: {
    Icon: (<ConnectIcon />)
  }
}