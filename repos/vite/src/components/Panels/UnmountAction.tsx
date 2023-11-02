import type { ComponentProps, MouseEventHandler } from 'react'

import {getStore} from '@store'
import { noOp } from '@keg-hub/jsutils'
import { Alert } from '@actions/modals/alert'
import { disconnectRepo } from '@actions/repo/api/disconnect'
import {
  Tooltip,
  stopEvent,
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
  
  return (
    <Tooltip
      loc='bottom'
      describeChild
      enterDelay={500}
      title={`Unmount repository`}
    >
      <IconButton
        sx={styles.button}
        onClick={onClick as MouseEventHandler<HTMLButtonElement>|undefined}
      >
        <CloudOffIcon {...rest} sx={styles.icon} />
      </IconButton>
    
    </Tooltip>
  )
}

export const UnmountAction = {
  id:`connect-repo`,
  Component: UnmountBtn,
  className:`goblet-connect-repo`,
  action:(e:Event) => {
    stopEvent(e)
    const { repo } = getStore().getState()
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

  },
}
