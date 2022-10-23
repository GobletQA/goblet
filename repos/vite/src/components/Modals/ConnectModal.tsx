import type { ComponentProps, ReactNode, ComponentType } from 'react'
import type { TBuiltForm } from '@hooks/forms'

import { useEffect } from 'react'
import Box from '@mui/material/Box'
import { ModalTypes } from '@constants'

import { noOpObj, noPropArr } from '@keg-hub/jsutils'



import { PlugIcon } from '@components/Icons'
import { useWatch, useController } from 'react-hook-form-mui'
import Grid from '@mui/material/Unstable_Grid2'
import { useGetRepos } from '@hooks/api/useGetRepos'

import { FormComponents, RenderInputs } from '@components/Form'
import { useConnectForm } from '@hooks/forms/useConnectForm'

import { ModalRoot } from '@components/ModalManager/ModalRoot'
import { LogoutIcon, CloudDownIcon }  from '@components/Icons'

import {
  Form,
  Input,
  AutoInput,
} from '@components/Form'

export type TConnectModal = ComponentProps<typeof ModalRoot>

export type TConnectFormProps = {
  form: TBuiltForm
  values:Record<any, any>
  setForm: (...args:any[]) => void
}

const ConnectForm = (props:TConnectFormProps) => {
  const {
    form,
    values,
    setForm
  } = props

  const [
    repo,
    branch,
    branchName,
    createBranch,
  ] = useWatch({
    name: [`repo`, `branch`, `branchName`, `createBranch`]
  })
  
  const { field } = useController({ name: `branch` })
  const { onChange:onChangeBranch } = field

  const { repos } = useGetRepos({ repo, branch })

  useEffect(() => {
    let obj = values
    
    if(values?.repo !== repo){
      obj = { ...obj, repo, branch: `` }
      // Reset the branch when the repo changes
      onChangeBranch(``)
    }
    else if(values?.branch !== branch)
      obj = { ...obj, branch }
    if(values?.branchName !== branchName)
      obj = { ...obj, branchName }
    if(values?.createBranch !== createBranch)
      obj = { ...obj, createBranch }

    values !== obj && setForm({ ...values, ...obj })

  }, [
    onChangeBranch,
    values,
    repo,
    branch,
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
        <RenderInputs
          form={form}
          repo={{ options: repos }}
          branch={{ options: repo?.branches || noPropArr, disabled: !repo }}
        />
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