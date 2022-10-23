import type { TBuiltForm } from '@hooks/forms'
import type { TModalComponent, TModalRef } from '@types'
import type { ReactNode } from 'react'

import { useEffect } from 'react'
import Box from '@mui/material/Box'
import { ModalTypes } from '@constants'
import Divider from '@mui/material/Divider'
import { PlugIcon } from '@components/Icons'
import { RenderInputs } from '@components/Form'
import { useGetRepos } from '@hooks/api/useGetRepos'
import { noOpObj, noPropArr } from '@keg-hub/jsutils'
import DialogContent from '@mui/material/DialogContent'
import { useConnectForm } from '@hooks/forms/useConnectForm'
import { useWatch, useController } from 'react-hook-form-mui'
import { LogoutIcon, CloudDownIcon }  from '@components/Icons'
import { ModalFooter } from '@components/ModalManager/ModalFooter'
import { ModalContent } from '@components/ModalManager/ModalContent'

import { Form } from '@components/Form'


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
  
  const { field:{ onChange:onChangeBranch } } = useController({ name: `branch` })

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
    <RenderInputs
      form={form}
      repo={{ options: repos }}
      branch={{ options: repo?.branches || noPropArr, disabled: !repo }}
    />
  )
}

const actionProps = {
  sx: {
    // padding: `0px`,
    // paddingTop: `24px`,
    // paddingBottom: `0px`,
    padding: `20px 24px`,
    justifyContent: `space-between`,
  }
}
const actions = [
  {
    color: `secondary` as const,
    variant: `text`  as const,
    label: `Sign Out`,
    onClick: (evt:Event, data:Record<any, any>) => {
      console.log(`------- logout -------`)
    },
    startIcon: <LogoutIcon />,
  },
  {
    color: `primary`  as const,
    variant: `contained`  as const,
    label: `Connect Repo`,
    startIcon: <CloudDownIcon />,
  },
]

export const ConnectModal:TModalRef = (props:TModalComponent) => {
  const { ModalMessage } = props

  const {
    form,
    values,
    setForm,
    onSuccess,
    isConnecting,
    connectError,
  } = useConnectForm({
    onSuccess: (data) => {
      console.log(`------- data -------`)
      console.log(data)
    }
  })

  actions[1].onClick = onSuccess

  return (
    <>
      <Box padding='20px 24px'>
        <ModalMessage
          error={connectError}
          loading={isConnecting && 'Connecting Repo ...'}
        />
        <Form
          {...form.form}
          onSuccess={onSuccess}
        >
          <Box marginBottom='24px' >
            <ConnectForm form={form} setForm={setForm} values={values} />
          </Box>
        </Form>
      </Box>
      <Divider />
      <ModalFooter
        actions={actions}
        actionProps={actionProps}
      />
    </>
  )
}

ConnectModal.modalType = ModalTypes.connect
ConnectModal.modalProps = {
  Footer: false,
  manualClose: true,
  contentProps: {
    sx: {
      padding: `0px`,
    }
  },
  title: `Connect Repo`,
  titleProps: {
    Icon: (<PlugIcon />)
  }
}