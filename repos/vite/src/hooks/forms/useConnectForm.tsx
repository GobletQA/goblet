import type { ComponentProps } from 'react'
import type { THFormHelpers } from './useFormHelpers'

import { useMemo } from 'react'
import { deepMerge } from '@keg-hub/jsutils'
import { useFormHelpers } from './useFormHelpers'

const formProps = {
  form: {
    values: {
      repo: ``,
      branch: ``,
    },
  },
  repo: {
    required: true,
    name: `repo`,
    label: `Select Repo`,
    textFieldProps: {
      placeholder: `Select a repo to connect to...`,
    },
    rules: {
      required: `Please select a repository`
    }
  },
  branch: {
    required: true,
    name: `branch`,
    label: `Select Branch`,
    textFieldProps: {
      placeholder: `Select the branch to use...`,
    },
    rules: {
      required: `Please select a branch`
    }
  },
  createBranch: {
    name: `createBranch`,
    label: `Create Branch`,
  },
  branchName: {
    name: `branchName`,
    label: `Branch Name`,
    textFieldProps: {
      placeholder: `Enter a branch name...`,
    },
  }
}

export type TConnectFormProps = {
  form: typeof formProps
}

export type TConnectForm = THFormHelpers & {
  values?:Record<any, any>
}

export const useConnectForm = (props:TConnectForm) => {
  const { values } = props

  const form = useMemo(() => {
    return deepMerge<typeof formProps>(formProps, { form: { values } })
  }, [values])
  
  const {
    onSuccess,
    isLoading:isConnecting,
    loadingError:connectError,
    setIsLoading:setIsConnecting,
    setLoadingError:setIsConnectError,
  } = useFormHelpers(props)
  
  return {
    form,
    onSuccess,
    connectError,
    isConnecting,
    setIsConnecting,
    setIsConnectError
  }
  
}