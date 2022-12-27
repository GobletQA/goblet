import type { TBuiltForm, TSetupFormProps } from '@types'
import type { ComponentType, MutableRefObject } from 'react'

import { gutter } from '@theme'
import Box from '@mui/material/Box'
import { useEffect, useMemo } from 'react'
import { useGetRepos } from '@hooks/api/useGetRepos'
import { noPropArr, noOpObj } from '@keg-hub/jsutils'
import { Form, RenderInputs } from '@components/Form'
import { useConnectRepo } from '@hooks/api/useConnectRepo'
import { useConnectForm } from '@hooks/forms/useConnectForm'
import { useWatch, useController } from 'react-hook-form-mui'
import { ModalMessage } from '@components/ModalManager/ModalMessage'

export type TBuiltConnectForm = ReturnType<typeof useConnectForm>

export type TConnectFormProps = {
  form: TBuiltForm
  loading: boolean
  values:Record<any, any>
  setForm: (...args:any[]) => void
}

export type TConnectForm = {
  FormMessage?: ComponentType<any>
  FormActions?: ComponentType<any>
  formActionProps?: Record<any, any>
  onConnect?: (...args:any[]) => void
  formRef?: MutableRefObject<TBuiltConnectForm|undefined>
}

const useSetupForm = ({
  form,
  options,
  formHelpers,
}:TSetupFormProps) => {
  const { onConnect, values, setForm } = options
  const connectRepo = useConnectRepo({
    form,
    values,
    setForm,
    onConnect,
    ...formHelpers,
  })

  const { loading } = formHelpers

  return useMemo(() => {
    form.$actions.signOut.loading = loading
    form.$actions.connectRepo.loading = loading
    form.$actions.connectRepo.onClick = connectRepo

    return form
  }, [form, connectRepo, loading])
}

const ConnectInputs = (props:TConnectFormProps) => {
  const {
    form,
    values,
    loading,
    setForm
  } = props

  const [
    repo,
    branch,
    newBranch,
    createBranch,
  ] = useWatch({
    name: [`repo`, `branch`, `newBranch`, `createBranch`]
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
    if(values?.newBranch !== newBranch)
      obj = { ...obj, newBranch }
    if(values?.createBranch !== createBranch)
      obj = { ...obj, createBranch }

    values !== obj && setForm({ ...values, ...obj })

  }, [
    repo,
    branch,
    values,
    newBranch,
    createBranch,
    onChangeBranch,
  ])

  return (
    <RenderInputs
      form={form}
      disableAll={loading}
      repo={{ options: repos }}
      branch={{ options: repo?.branches || noPropArr, disabled: !repo }}
    />
  )
}

export const ConnectForm = (props:TConnectForm) => {
  const {
    formRef,
    onConnect,
    FormActions,
    formActionProps=noOpObj,
    FormMessage=ModalMessage,
  } = props

  const connectForm = useConnectForm({
    onConnect,
    setupForm: useSetupForm
  })
  const {
    form,
    values,
    setForm,
    loading,
    formError,
  } = connectForm

  useEffect(() => {
    formRef && (formRef.current = connectForm)
  }, [connectForm])

  return (
    <>
      <Box padding={`${gutter.padding.px} ${gutter.padding.dpx}`}>
        <FormMessage
          error={formError}
          loading={loading && 'Connecting Repo'}
        />
        <Form {...form.form} >
          <Box marginBottom={gutter.margin.px} >
            <ConnectInputs
              form={form}
              values={values}
              loading={loading}
              setForm={setForm}
            />
          </Box>
        </Form>
      </Box>
      {FormActions && (
        <FormActions
          {...formActionProps}
          actions={form.$actions}
        />
      )}
    </>
  )
  
}