import type { TModalComponent, TModalRef, TBuiltForm } from '@types'

import { gutter } from '@theme'
import { ModalTypes } from '@constants'
import Divider from '@mui/material/Divider'
import { PlugIcon } from '@components/Icons'
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
  manualClose: true,
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