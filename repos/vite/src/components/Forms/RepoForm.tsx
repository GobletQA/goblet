import type { TBuiltForm, TSetupFormProps } from '@types'
import type { ComponentType, MutableRefObject } from 'react'

import { gutter } from '@theme'
import Box from '@mui/material/Box'
import { useEffect, useMemo } from 'react'
import { noPropArr, noOpObj } from '@keg-hub/jsutils'
import { Form, RenderInputs } from '@components/Form'
import { useRepoForm } from '@hooks/forms/useRepoForm'
import { useWatch, useController } from 'react-hook-form-mui'
import { ModalMessage } from '@components/ModalManager/ModalMessage'

export type TBuiltRepoForm = ReturnType<typeof useRepoForm>

export type TRepoFormProps = {
  form: TBuiltForm
  loading: boolean
  values:Record<any, any>
  setForm: (...args:any[]) => void
}

export type TRepoForm = {
  FormMessage?: ComponentType<any>
  FormActions?: ComponentType<any>
  formActionProps?: Record<any, any>
  formRef?: MutableRefObject<TBuiltRepoForm|undefined>
}

const RepoInputs = (props:TRepoFormProps) => {
  
  return null
}


export const RepoForm = (props:TRepoForm) => {
  const {
    formRef,
    FormActions,
    formActionProps=noOpObj,
    FormMessage=ModalMessage,
  } = props

  const repoForm = useRepoForm({})
  const {
    form,
    values,
    setForm,
    loading,
    formError,
  } = repoForm

  useEffect(() => {
    formRef && (formRef.current = repoForm)
  }, [repoForm])

  return (
    <>
      <Box padding={`${gutter.padding.px} ${gutter.padding.dpx}`}>
        <FormMessage
          error={formError}
          loading={loading && 'Loading Repo'}
        />
        <Form {...form.form} >
          <Box marginBottom={gutter.margin.px} >
            <RepoInputs
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