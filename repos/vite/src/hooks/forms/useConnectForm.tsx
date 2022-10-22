import type { ComponentType } from 'react'
import { deepMerge } from '@keg-hub/jsutils'
import { useFormHelpers } from './useFormHelpers'
import type { THFormHelpers } from './useFormHelpers'
import { useMemo, useState, useCallback } from 'react'

const formProps = {}
const formFields = {
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
    decor: {
      color: "secondary",
      Component: IconButton,
      Icon: SyncIcon,
    },
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
      inputProps: {},
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
    placeholder: `Enter a branch name...`,
    decor: {
      labelPos: 'bottom',
      label: 'New Branch',
      name: 'createBranch',
      Component: IconToggle,
      Icon: SubArrowRightIcon,
      iconProps:{ fontSize: 'small' },
      labelSx: {
        [`> .MuiFormControlLabel-label`]: {
          fontSize: `10px`,
          marginTop: `-5px`,
        }
      }
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

  const {
    onSuccess,
    isLoading:isConnecting,
    loadingError:connectError,
    setIsLoading:setIsConnecting,
    setLoadingError:setIsConnectError,
  } = useFormHelpers(props)

  const form = useMemo(() => {
    return Object.assign(formProps, formFields, {
      form: {
        values: { ...formFields.values, ...values },
      }
    })
  }, [values])

  const [formValues, setFormValues] = useState({})
  const [createActive, setCreateActive] = useState(false)

  form.branchName.disabled = !createActive
  form.branchName.decor.disabled = !formValues.branch

  form.branchName.decor.active = createActive
  form.branchName.decor.onClick = useCallback((evt:any) => {
    const checked = evt.target.checked
    setCreateActive(checked)
    setFormValues({ ...formValues, createBranch: checked })
  }, [formValues, createActive])

  return {
    form,
    onSuccess,
    connectError,
    isConnecting,
    setIsConnecting,
    setIsConnectError,
    values: formValues,
    setForm:setFormValues,
  }
  
}