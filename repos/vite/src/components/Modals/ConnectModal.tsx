import type { TModalComponent, TModalRef } from '@types'

import { useMemo } from 'react'
import { gutter } from '@theme'
import Box from '@mui/material/Box'
import { useContainer } from '@store'
import { ModalTypes } from '@constants'
import { EContainerState } from '@types'
import Divider from '@mui/material/Divider'
import { PlugIcon } from '@components/Icons'
import { Loading } from '@components/Loading'
import { ConnectForm } from '@components/Forms/ConnectForm'
import { ModalFooter } from '@components/ModalManager/ModalFooter'

const WaitOnContainer = () => {
  return (
    <Box
      display='flex'
      alignItems='center'
      margin={gutter.margin.dpx}
    >
      <Loading
        message={`Initializing session....`}
        messageSx={{ marginTop: gutter.margin.dpx, marginBottom: gutter.margin.px }}
      />
    </Box>
  )
}

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