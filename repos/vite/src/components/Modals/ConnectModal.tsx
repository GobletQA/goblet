import type { ComponentProps } from 'react'
import type { TConnectFormProps } from '@hooks/forms/useConnectForm'
import { useWatch } from 'react-hook-form-mui'

import Box from '@mui/material/Box'
import { ModalTypes } from '@constants'
import { PlugIcon } from '@components/Icons'
import { useGetRepos } from '@hooks/api/useGetRepos'
import { ModalRoot } from '@components/ModalManager/ModalRoot'

import { useConnectForm } from '@hooks/forms/useConnectForm'
import {
  Input,
  Form,
  Checkbox,
  AutoInput,
} from '@components/Form'

export type TConnectModal = ComponentProps<typeof ModalRoot>

const ConnectForm = (props:TConnectFormProps) => {
  const {
    form
  } = props
  
  const watched = useWatch({
    name: [`repo`, `branch`, `createBranch`, `newBranch`]
  })
  
  const { repos, branches } = useGetRepos({
    repo: watched[0],
    branch:watched[1]
  })

  console.log(`------- watched -------`)
  console.log(watched)

  return (
    <>
      <AutoInput
        {...form.repo}
        options={repos}
      />
      <br/>
      <AutoInput
        {...form.branch}
        options={branches}
      />
      <br/>
      <Checkbox
        name={'createBranch'}
        label={'Create Branch'}
      />
      <br/>
      <br/>
      <Input
        name={'newBranch'}
        label={'Branch Name'}
      />
    </>
  )
}

export const ConnectModal = (props:TConnectModal) => {
  const { ModalMessage } = props

  const {
    form,
    onSuccess,
    isConnecting,
    connectError,
    setIsConnecting,
    setIsConnectError,
  } = useConnectForm({
    onSuccess: (data) => {
      console.log(`------- data -------`)
      console.log(data)
    }
  })

  return (
    <Box>
      <ModalMessage
        error={connectError}
        loading={isConnecting && 'Connecting Repo ...'}
      />
      <Form {...form.form} onSuccess={onSuccess} >
        <ConnectForm form={form} />
      </Form>
    </Box>
  )
}

ConnectModal.modalType = ModalTypes.connect
ConnectModal.modalProps = {
  title: `Connect Repo`,
  manualClose: true,
  titleProps: {
    Icon: (<PlugIcon />)
  }
}