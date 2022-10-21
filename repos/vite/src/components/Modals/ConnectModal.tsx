import type { ComponentProps } from 'react'
import type { TConnectFormProps } from '@hooks/forms/useConnectForm'
import { useWatch } from 'react-hook-form-mui'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Unstable_Grid2'
import { ModalTypes } from '@constants'
import { PlugIcon } from '@components/Icons'
import { useGetRepos } from '@hooks/api/useGetRepos'
import { LogoutIcon, SyncIcon, CloudDownIcon }  from '@components/Icons'
import { ModalRoot } from '@components/ModalManager/ModalRoot'

import { useConnectForm } from '@hooks/forms/useConnectForm'
import {
  Input,
  Form,
  Button,
  Switch,
  Checkbox,
  AutoInput,
} from '@components/Form'

export type TConnectModal = ComponentProps<typeof ModalRoot>

const ConnectForm = (props:TConnectFormProps) => {
  const {
    form
  } = props

  const [
    repo,
    branch,
    createBranch,
    newBranch,
  ] = useWatch({
    name: [`repo`, `branch`, `createBranch`, `newBranch`]
  })
  
  const { repos, branches } = useGetRepos({
    repo,
    branch
  })

  return (
    <Box>
      <Grid
        container
        rowSpacing={2}
        columnSpacing={1}
        disableEqualOverflow={true}
      >
        <Grid xs={12}>
          <AutoInput
            {...form.repo}
            options={repos}
          />
        </Grid>
        <Grid
          xs="auto"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Button>
            <SyncIcon />
          </Button>
        </Grid>
        <Grid xs={12}>
          <AutoInput
            {...form.branch}
            options={branches}
          />
        </Grid>
        <Grid
          xs="auto"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
        <Checkbox
          label={'New Branch'}
          name={'createBranch'}
        />
        </Grid>
        <Grid xs={true} >
          <Input
            disabled={!createBranch}
            name={'newBranch'}
            label={'Branch Name'}
          />
        </Grid>
      </Grid>
    </Box>
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
      <Form
        {...form.form}
        onSuccess={onSuccess}
      >
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
  },
  actionProps: {
    sx: {
      padding: `16px 24px`,
      justifyContent: `space-between`,
    }
  },
  actions: [
    {
      color: `error`,
      variant: `text`,
      label: `Sign Out`,
      startIcon: <LogoutIcon />,
    },
    {
      color: `primary`,
      variant: `contained`,
      label: `Connect Repo`,
      startIcon: <CloudDownIcon />,
    },
  ]
}