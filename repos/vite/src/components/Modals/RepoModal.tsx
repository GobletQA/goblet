import type { TModalComponent, TModalRef } from '@types'

import { EModalTypes } from '@types'
import Divider from '@mui/material/Divider'
import { SourceIcon } from '@gobletqa/components'
import { gutter } from '@gobletqa/components/theme'
import { RepoForm } from '@components/Forms/RepoForm'
import { ModalFooter } from '@components/ModalManager/ModalFooter'

export const RepoModal:TModalRef = (props:TModalComponent) => {
  const { ModalMessage } = props

  return (
    <RepoForm
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

RepoModal.modalType = EModalTypes.repo
RepoModal.modalProps = {
  title: `Repo`,
  Footer: false,
  manualClose: true,
  contentProps: {
    sx: {
      padding: gutter.padding.none,
    }
  },
  titleProps: {
    Icon: (<SourceIcon />)
  }
}