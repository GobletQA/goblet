import type { ComponentProps, MouseEventHandler } from 'react'

import { useRepo } from '@store'
import {noOp} from '@keg-hub/jsutils'
import { Alert } from '@actions/modals/alert'
import { disconnectRepo } from '@actions/repo/api/disconnect'
import {
  useInline,
  IconButton,
  CloudOffIcon,
} from '@gobletqa/components'
import {
  ModalTitle,
  ModalSubText,
  ModalContainer
} from '@components/Modals/Modal.styled'


export type TUnmountContent = {}
export type TUnmountBtn = ComponentProps<typeof CloudOffIcon>

const styles = {
  icon: {
    fontSize: `16px`
  },
  button: {
    padding: `0px`,
    marginRight: `0px`,
    pointerEvents: `auto`,
  }
}

const UnmountBtn = (props:TUnmountBtn) => {
  const { onClick, ...rest } = props
  
  const repo = useRepo()
  
  const onClickAlert = useInline((e:any) => {
    e?.preventDefault?.()
    e?.stopPropagation?.()

    const name = repo?.git?.repoName || repo?.name || `the mounted repo`
    Alert({
      title: `Unmount Repo`,
      okText: `Yes`,
      onOk: () => {
        disconnectRepo()
      },
      cancelText: `No`,
      onCancel: () => {},
      content: (
        <ModalContainer>
          <ModalTitle>
            Are you sure your want to unmount {name}?
          </ModalTitle>
          <ModalSubText>
            All files and content will be permanently removed.
          </ModalSubText>
          <ModalSubText>
            Unsaved work can not be recovered.
          </ModalSubText>
        </ModalContainer>
      ),
    })
  })

  return (
      <IconButton
        sx={styles.button}
        tooltip={`Unmount repository`}
        onClick={onClickAlert as MouseEventHandler<HTMLButtonElement>|undefined}
        Icon={(<CloudOffIcon {...rest} sx={styles.icon} />)}
      />
  )
}

export const UnmountAction = {
  action:noOp,
  id:`connect-repo`,
  Component: UnmountBtn,
  className:`goblet-connect-repo`,
}
