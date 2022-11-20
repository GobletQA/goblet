import type { TModalComponent, TModalRef } from '@types'

import { gutter } from '@theme'
import Divider from '@mui/material/Divider'
import { PlugIcon } from '@components/Icons'
import { ModalTypes, AuthActive } from '@constants'
import { ConnectForm } from '@components/Forms/ConnectForm'
import { ModalFooter } from '@components/ModalManager/ModalFooter'

export const ConnectModal:TModalRef = (props:TModalComponent) => {
  const { ModalMessage } = props

  return (
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
  manualClose: !AuthActive,
  contentProps: {
    sx: {
      padding: gutter.padding.none,
    }
  },
  title: `Connect Repo`,
  titleProps: {
    Icon: (<PlugIcon />)
  }
}