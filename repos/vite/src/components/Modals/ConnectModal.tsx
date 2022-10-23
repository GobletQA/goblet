import type { TBuiltForm } from '@types'
import type { TModalComponent, TModalRef } from '@types'

import { useEffect, useCallback } from 'react'

import { gutter } from '@theme'
import Box from '@mui/material/Box'
import { ModalTypes } from '@constants'
import Divider from '@mui/material/Divider'
import { noPropArr } from '@keg-hub/jsutils'
import { PlugIcon } from '@components/Icons'
import { RenderInputs } from '@components/Form'
import { useGetRepos } from '@hooks/api/useGetRepos'
import { useConnectForm } from '@hooks/forms/useConnectForm'
import { useWatch, useController } from 'react-hook-form-mui'
import { ModalFooter } from '@components/ModalManager/ModalFooter'

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

export const ConnectModal:TModalRef = (props:TModalComponent) => {
  const { ModalMessage } = props

  const {
    form,
    values,
    setForm,
    onSuccess,
    isConnecting,
    connectError,
  } = useConnectForm()

  form.$actions.connectRepo.onClick = useCallback(() => {
    console.log(`------- values -------`)
    console.log(values)

  }, [values])

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
        actions={form.$actions}
        sx={{
          padding: gutter.padding.px,
          justifyContent: `space-between`,
        }}
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
      padding: gutter.padding.none,
    }
  },
  title: `Connect Repo`,
  titleProps: {
    Icon: (<PlugIcon />)
  }
}