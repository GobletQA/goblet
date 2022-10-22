import type { ComponentProps } from 'react'
import type { TConnectFormProps } from '@hooks/forms/useConnectForm'

import { useEffect } from 'react'
import Box from '@mui/material/Box'
import { useWatch } from 'react-hook-form-mui'
import Grid from '@mui/material/Unstable_Grid2'
import { ModalTypes } from '@constants'
import { PlugIcon } from '@components/Icons'
import { useGetRepos } from '@hooks/api/useGetRepos'
import { useColorMap } from '@hooks/theme/useColorMap'
import { useConnectForm } from '@hooks/forms/useConnectForm'
import { ModalRoot } from '@components/ModalManager/ModalRoot'
import { LogoutIcon, CloudDownIcon, SubArrowRightIcon }  from '@components/Icons'

import {
  Form,
  Input,
  AutoInput,
  IconToggle,
} from '@components/Form'

export type TConnectModal = ComponentProps<typeof ModalRoot>

const ConnectForm = (props:TConnectFormProps) => {
  const {
    form,
    values,
    setForm
  } = props

  const colorMap = useColorMap()

  const [
    repo,
    branch,
    branchName,
    createBranch,
  ] = useWatch({
    name: [`repo`, `branch`, `branchName`, `createBranch`]
  })

  const { repos, branches } = useGetRepos({
    repo,
    branch
  })
  
  const createActive = Boolean(createBranch)
  
  useEffect(() => {
    let obj = values
    
    if(values?.repo !== repo)
      obj = { ...obj, repo }
    if(values?.branch !== branch)
      obj = { ...obj, branch }
    if(values?.branchName !== branchName)
      obj = { ...obj, branchName }
    if(values?.createBranch !== createBranch)
      obj = { ...obj, createBranch }

    values !== obj && setForm({ ...values, ...obj })

  }, [
    repo,
    branch,
    values,
    branchName,
    createBranch,
  ])

  return (
    <Box marginBottom='24px' >
      <Grid
        container
        rowSpacing={2}
        columnSpacing={1}
        disableEqualOverflow={true}
      >
        <Grid xs={true} >
          <AutoInput
            {...form.repo}
            options={repos}
          />
        </Grid>
        <Grid xs={12}>
          <AutoInput
            {...form.branch}
            disabled={!repo}
            options={branches}
          />
        </Grid>
        <Grid xs={8} sm={10} >
          <Input {...form.branchName} />
        </Grid>
      </Grid>
    </Box>
  )
}

export const ConnectModal = (props:TConnectModal) => {
  const { ModalMessage } = props

  const {
    form,
    values,
    setForm,
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
        <ConnectForm form={form} setForm={setForm} values={values} />
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