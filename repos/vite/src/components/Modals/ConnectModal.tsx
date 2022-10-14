import type { ComponentProps } from 'react'

import { useState } from 'react'
import Box from '@mui/material/Box'

import { ModalTypes } from '@constants'


import { PlugIcon } from '@components/Icons'

import { ModalRoot } from '@components/ModalManager/ModalRoot'
export type TConnectModal = ComponentProps<typeof ModalRoot>

export const ConnectModal = (props:TConnectModal) => {
  const { ModalMessage } = props
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectError, setConnectError] = useState(``)

  return (
    <Box>
      <ModalMessage
        error={connectError}
        loading={isConnecting && 'Connecting Repo ...'}
      />

    </Box>
  )
}

ConnectModal.modalType = ModalTypes.connect
ConnectModal.modalProps = {
  title: `Connect Repo`,
  manualClose: false,
  titleProps: {
    Icon: (<PlugIcon />)
  }
}