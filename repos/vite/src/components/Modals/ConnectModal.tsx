import type { ComponentProps } from 'react'

import Box from '@mui/material/Box'
import { useWatch } from 'react-hook-form-mui'
import Grid from '@mui/material/Unstable_Grid2'
import { ModalTypes } from '@constants'
import { PlugIcon } from '@components/Icons'
import { useGetRepos } from '@hooks/api/useGetRepos'
import { useColorMap } from '@hooks/theme/useColorMap'
import { IconButton } from '@components/Buttons/IconButton'
import { useConnectForm } from '@hooks/forms/useConnectForm'
import { ModalRoot } from '@components/ModalManager/ModalRoot'
import type { TConnectFormProps } from '@hooks/forms/useConnectForm'
import { LogoutIcon, SyncIcon, CloudDownIcon, SubArrowRightIcon }  from '@components/Icons'

import {
  Form,
  Input,
  AutoInput,
  IconToggle,
} from '@components/Form'

export type TConnectModal = ComponentProps<typeof ModalRoot>

const ConnectForm = (props:TConnectFormProps) => {
  const {
    form
  } = props

  const colorMap = useColorMap()

  const [
    repo,
    branch,
    newBranch,
    createBranch,
  ] = useWatch({
    name: [`repo`, `branch`, `createBranch`, `newBranch`]
  })
  
  const { repos, branches } = useGetRepos({
    repo,
    branch
  })
  
  const createActive = Boolean(createBranch)
  
  return (
    <Box
      marginBottom='24px'
    >
      <Grid
        container
        columns={16}
        rowSpacing={2}
        columnSpacing={1}
        disableEqualOverflow={true}
      >
        <Grid
          xs="auto"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <IconButton color="secondary" >
            <SyncIcon />
          </IconButton>
        </Grid>
        <Grid xs={13} sm={14} md={15} >
          <AutoInput
            {...form.repo}
            required={true}
            options={repos}
          />
        </Grid>
        <Grid xs={16}>
          <AutoInput
            {...form.branch}
            required={true}
            disabled={!repo}
            options={branches}
          />
        </Grid>
        <Grid
          xs="auto"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <IconToggle
            disabled={!repo}
            labelPos='bottom'
            label='New Branch'
            name='createBranch'
            active={createActive}
            Icon={SubArrowRightIcon}
            iconProps={{ fontSize: 'small' }}
            // @ts-ignore
            labelProps={{
              sx: {
                [`> .MuiFormControlLabel-label`]: {
                  fontSize: `10px`,
                  marginTop: `-5px`,
                }
              }
            }}
          />
        </Grid>
        <Grid xs={13} sm={14} >
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
      color: `secondary`,
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